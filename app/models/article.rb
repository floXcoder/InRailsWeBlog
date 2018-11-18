# frozen_string_literal: true

# == Schema Information
#
# Table name: articles
#
#  id                      :bigint(8)        not null, primary key
#  user_id                 :bigint(8)
#  topic_id                :bigint(8)
#  mode                    :integer          default("story"), not null
#  title_translations      :jsonb
#  summary_translations    :jsonb
#  content_translations    :jsonb            not null
#  languages               :string           default([]), not null, is an Array
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
#  allow_comment           :boolean          default(TRUE), not null
#  pictures_count          :integer          default(0)
#  outdated_articles_count :integer          default(0)
#  bookmarks_count         :integer          default(0)
#  comments_count          :integer          default(0)
#  slug                    :string
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class Article < ApplicationRecord
  # Article type:
  #   story => to write a full article with all fields available in a dedicated page
  #   note => to complete a current section in current page
  #   link => to save links as RSS (only title and content) in current page
  # All types can be private or a draft version

  # == Attributes ===========================================================
  include EnumsConcern
  enum mode: ARTICLE_MODE
  enum visibility: VISIBILITY
  enums_to_tr('article', [:mode, :visibility])

  include TranslationConcern
  # Add current_language to model
  translates :title, :summary, :content,
             auto_strip_translation_fields:    [:title, :summary],
             fallbacks_for_empty_translations: true

  # Strip whitespaces
  auto_strip_attributes :reference

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # == Extensions ===========================================================
  # Voteable model
  acts_as_voteable

  # Versioning
  has_paper_trail only: [:title_translations, :summary_translations, :content_translations, :reference]

  # Track activities
  ## scopes: most_viewed, most_clicked, recently_tracked, populars, home
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views, callbacks: { click: :add_visit_activity }

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  # SEO
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  searchkick searchable:  [:title, :content, :reference],
             filterable:  [:mode, :visibility],
             word_middle: [:title, :content],
             suggest:     [:title],
             highlight:   [:title, :content, :reference],
             language:    -> { I18n.locale == :fr ? 'french' : 'english' }
  # index_name:  -> { "#{name.tableize}-#{self.current_language || I18n.locale}" }

  # Comments
  ## scopes: most_rated, recently_rated
  include CommentableConcern

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             class_name:    'User',
             counter_cache: true

  belongs_to :topic,
             counter_cache: true

  has_many :tagged_articles,
           autosave:  true,
           dependent: :destroy
  has_many :tags,
           through: :tagged_articles
  has_many :parent_tags,
           -> { where(tagged_articles: { parent: true }) },
           through: :tagged_articles,
           source:  :tag
  has_many :child_tags,
           -> { where(tagged_articles: { child: true }) },
           through: :tagged_articles,
           source:  :tag

  has_many :tag_relationships,
           autosave:  true,
           dependent: :destroy

  has_many :outdated_articles,
           dependent: :destroy
  has_many :marked_as_outdated,
           through: :outdated_articles,
           source:  :user

  has_many :parent_relationships,
           autosave:    true,
           class_name:  'ArticleRelationship',
           foreign_key: 'parent_id',
           dependent:   :destroy
  has_many :children,
           through: :parent_relationships,
           source:  :child

  has_many :child_relationships,
           autosave:    true,
           class_name:  'ArticleRelationship',
           foreign_key: 'child_id',
           dependent:   :destroy
  has_many :parents,
           through: :child_relationships,
           source:  :parent

  has_many :bookmarks,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarks,
           source:  :user

  has_many :followers,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarks,
           source:  :user

  # has_many :activities,
  #          as:         :trackable,
  #          class_name: 'PublicActivity::Activity'
  has_many :user_activities,
           as:         :recipient,
           class_name: 'PublicActivity::Activity'

  has_many :pictures,
           -> { order 'created_at ASC' },
           as:        :imageable,
           autosave:  true,
           dependent: :destroy
  accepts_nested_attributes_for :pictures, allow_destroy: true, reject_if: lambda {
    |picture| picture['picture'].blank? && picture['image_tmp'].blank?
  }

  # == Validations ==========================================================
  validates :user,
            presence: true
  validates :topic,
            presence: true

  validates :title,
            length: { minimum: CONFIG.article_title_min_length, maximum: CONFIG.article_title_max_length }
  validates :topic,
            presence: true,
            unless:   -> { draft? }

  validates :summary,
            length: { minimum: CONFIG.article_summary_min_length, maximum: CONFIG.article_summary_max_length },
            if:     -> { summary.present? }

  validates :content,
            presence: true,
            length:   { minimum: CONFIG.article_content_min_length, maximum: CONFIG.article_content_max_length },
            unless:   -> { reference.present? }

  validates :languages,
            presence: true

  validates :notation,
            inclusion: CONFIG.notation_min..CONFIG.notation_max

  validates :visibility,
            presence: true

  validate :current_topic_belongs_to_user

  validates :tagged_articles,
            presence: true,
            unless:   -> { draft? }

  validate :pertinent_tags

  validate :prevent_revert_to_draft,
           on: :update

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :user_id)',
          user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Article.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_slug, current_user_id = nil) {
    from_user_id(User.find_by(slug: user_slug)&.id, current_user_id)
  }
  scope :from_user_id, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :from_topic, -> (topic_slug) {
    where(topic_id: Topic.find_by(slug: topic_slug).id)
    # includes(:topic).where(topics: { slug: topic_slug }) # Slower ??
  }
  scope :from_topic_id, -> (topic_id = nil) {
    where(topic_id: topic_id)
  }

  scope :with_tags, -> (tag_slugs) { left_outer_joins(:tags).where(tags: { slug: tag_slugs }) }
  scope :with_no_parent_tags, -> (parent_tag_slugs) { joins(:tags).where(tagged_articles: { parent: false }, tags: { slug: parent_tag_slugs }) }
  scope :with_parent_tags, -> (parent_tag_slugs) { joins(:tags).where(tagged_articles: { parent: true }, tags: { slug: parent_tag_slugs }) }
  scope :with_child_tags, -> (child_tag_slugs) { joins(:tags).where(tagged_articles: { child: true }, tags: { slug: child_tag_slugs }) }

  scope :published, -> { where(draft: false) }

  scope :bookmarked_by_user, -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  scope :include_element, -> { includes(:user, :tagged_articles) }

  # == Callbacks ============================================================
  # Visibility: private for draft articles
  before_save do |article|
    article.visibility = 'only_me' if article.draft?
  end

  # Comments: doesn't allow for private or article other than story
  before_save do |article|
    article.allow_comment = false if article.visibility == 'only_me' || article.mode != 'story'
  end

  # after_commit :update_search_index

  # == Class Methods ========================================================
  def self.as_json(articles, options = {})
    return nil unless articles

    serializer_options = {
      root: articles.is_a?(Article) ? 'article' : 'articles'
    }

    serializer_options.merge(
      scope:      options.delete(:current_user),
      scope_name: :current_user
    ) if options.key?(:current_user)

    serializer_options[articles.is_a?(Article) ? :serializer : :each_serializer] = if options[:strict]
                                                                                     ArticleStrictSerializer
                                                                                   elsif options[:sample]
                                                                                     ArticleSampleSerializer
                                                                                   else
                                                                                     ArticleSerializer
                                                                                   end

    ActiveModelSerializers::SerializableResource.new(articles, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(articles, options = {})
    return nil unless articles

    as_json(articles, options)[articles.is_a?(Article) ? :article : :articles]
  end

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.user_id if user
  end

  def default_picture
    default_picture = ''

    picture = if self.pictures_count > 0
                # Use sort_by to avoid N+1 queries and new graph model
                self.pictures.sort_by(&:priority).reverse.first.image.medium.url
              else
                default_picture
              end

    picture.present? || default_picture.present? ? AssetManifest.image_path(picture || default_picture) : nil
  end

  def mark_as_outdated(user)
    if self.marked_as_outdated.exists?(user.id)
      errors.add(:outdated, I18n.t('activerecord.errors.models.outdated_article.already_outdated'))
      return false
    else
      return self.marked_as_outdated.push(user)
    end
  end

  def remove_outdated(user)
    if !self.marked_as_outdated.exists?(user.id)
      errors.add(:outdated, I18n.t('activerecord.errors.models.outdated_article.not_outdated'))
      return false
    else
      return self.marked_as_outdated.delete(user)
    end
  end

  def outdated?(user)
    self.marked_as_outdated.exists?(user.id)
  end

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? followers.include?(user) : false
  end

  def slug_candidates
    [
      "#{self.title}__at__#{self.topic.slug}"
    ]
  end

  # Called by friendlyId to transform 'at' to @
  def normalize_friendly_id(_string = nil)
    super.gsub('__at__', '@')
  end

  def mode_translated
    mode_to_tr
  end

  # def strip_content
  #   sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish if self.content
  # end

  def formatted_content
    formatted_content = public_content

    # formatted_content = formatted_content.gsub(/<img (.*?)\/?>/im, '')

    # Format returns to line
    formatted_content = formatted_content.gsub(/\<br\>/im, '@@').gsub(/\<p\>/im, '@@')
    formatted_content = ActionController::Base.helpers.strip_tags(formatted_content)
    formatted_content = formatted_content.gsub(/@@/im, '<br>')

    return formatted_content
  end

  def public_content
    self.content&.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
  end

  def private_content?
    self.content&.match?(/<(\w+) class="secret">.*?<\/\1>/im)
  end

  def adapted_content(current_user_id)
    formatted_content = if private_content? && self.user_id != current_user_id
                          public_content
                        else
                          content
                        end

    return formatted_content
  end

  def summary_content(size = 90, current_user_id = nil)
    adapted_content(current_user_id).summary(size)
  end

  def search_data
    {
      id:               id,
      user_id:          user_id,
      topic_id:         topic_id,
      topic_name:       topic&.name,
      topic_slug:       topic&.slug,
      tag_ids:          tags.ids,
      mode:             mode,
      mode_translated:  mode_translated,
      current_language: current_language,
      title:            title || '', # Title cannot be nil for suggest
      content:    formatted_content,
      reference:  reference,
      languages:  languages,
      draft:      draft,
      notation:   notation,
      priority:   priority,
      visibility: visibility,
      archived:   archived,
      accepted:   accepted,
      created_at: created_at,
      updated_at: updated_at,
      rank:       rank,
      popularity: popularity,
      slug:       slug
      # summary:          summary,
      # private_content:   strip_content, # Do not expose secret content
    }
  end

  # def update_search_index
  #   # Update index to handle multi-languages
  #   self.reindex
  #
  #   # Needed?
  #   # Article.search_index.promote("#{self.class.name.tableize}-#{self.class.current_language || I18n.locale}")
  # end

  # SEO
  def meta_description
    [self.title, self.summary&.summary(60)].compact.join(I18n.t('helpers.colon'))
  end

  private

  def add_visit_activity(user_id = nil, parent_id = nil)
    return unless user_id

    user = User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self, owner: user, params: { topic_id: parent_id })
  end

  def current_topic_belongs_to_user
    return unless self.topic_id.present? && self.topic_id_changed?

    unless self.user.topics.exists?(self.topic_id)
      errors.add(:topic, I18n.t('activerecord.errors.models.article.bad_topic_owner'))
    end
  end

  def pertinent_tags
    return unless self.tagged_articles

    unless self.tags.all? { |tag| tag.visibility == self.topic.visibility }
      errors.add(:tagged_articles, I18n.t('activerecord.errors.models.article.pertinent_tags'))
    end
  end

  def prevent_revert_to_draft
    if self.everyone? && draft_changed? && !draft_was
      errors.add(:base, I18n.t('activerecord.errors.models.article.prevent_revert_to_draft'))
    end
  end

end
