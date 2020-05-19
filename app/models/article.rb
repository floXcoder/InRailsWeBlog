# frozen_string_literal: true
# == Schema Information
#
# Table name: articles
#
#  id                      :bigint           not null, primary key
#  user_id                 :bigint
#  topic_id                :bigint
#  mode                    :integer          default("note"), not null
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
#  contributor_id          :bigint
#  inventories             :jsonb            not null
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
  translates :title, :summary, :content,
             auto_strip_translation_fields:    [:title, :summary],
             fallbacks_for_empty_translations: true

  # Strip whitespaces
  auto_strip_attributes :reference

  delegate :popularity, :popularity=,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # External provided shared link
  attr_accessor :shared_link

  # == Extensions ===========================================================
  # Voteable model
  acts_as_voteable

  # Versioning
  has_paper_trail only: [:contributor, :title_translations, :summary_translations, :content_translations, :reference, :inventories]

  # Track activities
  ## scopes: most_viewed, most_clicked, recently_tracked, populars, home
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views, callbacks: { clicks: :add_visit_activity }

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  # SEO
  include FriendlyId
  friendly_id :slug_candidates, use: [:slugged, :localized_slug]

  # Search
  # Only filterable can be used in where options!
  searchkick word_middle: [:title, :content], # To improve speed for autocomplete
             suggest:    [:title],
             highlight:  [:title, :content],
             language:   -> { I18n.locale == :fr ? 'french' : 'english' },
             index_name: -> { "#{self.name.tableize}-#{I18n.locale}" }
  # Cannot search in inventory fields if these options are used:
  # searchable:  [:title, :content, :reference],
  # filterable:  [:mode, :visibility, :draft, :languages, :notation, :accepted, :home_page, :user_id, :topic_id, :tag_ids, :tag_slugs],

  # Comments
  ## scopes: most_rated, recently_rated
  include CommentableConcern

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             counter_cache: true

  belongs_to :contributor,
             class_name: 'User',
             optional:   true

  belongs_to :topic,
             counter_cache: true

  has_many :tagged_articles,
           # -> { order 'parent desc' },
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

  has_one :share,
          -> { where(shares: { mode: :link }) },
          as:          :shareable,
          class_name:  'Share',
          foreign_key: 'shareable_id',
          dependent:   :destroy
  has_many :shares,
           as:          :shareable,
           class_name:  'Share',
           foreign_key: 'shareable_id',
           dependent:   :destroy
  #   has_many :contributors,
  #            through: :shares,
  #            source:  :contributor

  has_many :user_activities,
           as:         :recipient,
           class_name: 'PublicActivity::Activity'

  has_many :pictures,
           # -> { order 'created_at ASC' },
           as:        :imageable,
           autosave:  true,
           dependent: :destroy
  accepts_nested_attributes_for :pictures,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['picture'].blank? && picture['image_tmp'].blank?
                                }

  # == Validations ==========================================================
  validates :user,
            presence: true
  validates :topic,
            presence: true

  validates :mode,
            presence: true

  validates :title,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.article_title_min_length, maximum: InRailsWeBlog.config.article_title_max_length },
            unless:   -> { draft? }

  validates :summary,
            length: { minimum: InRailsWeBlog.config.article_summary_min_length, maximum: InRailsWeBlog.config.article_summary_max_length },
            if:     -> { summary.present? }

  validates :content,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.article_content_min_length, maximum: InRailsWeBlog.config.article_content_max_length },
            unless:   -> { reference.present? || inventory? }

  validates :languages,
            presence: true

  validates :notation,
            inclusion: InRailsWeBlog.config.notation_min..InRailsWeBlog.config.notation_max

  validates :visibility,
            presence: true

  validates :tagged_articles,
            presence: true,
            unless:   -> { draft? }

  validates :inventories,
            presence: true,
            if:       -> { inventory? }

  validate :inventory_fields,
           if: -> { inventory? }

  validate :current_topic_belongs_to_user

  validate :pertinent_tags

  validate :prevent_revert_to_draft,
           on: :update

  validates :slug,
            presence:   true,
            uniqueness: { case_sensitive: false }

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

  scope :from_topic, -> (topic_slug, user_id) {
    where(topic_id: Topic.find_by(slug: topic_slug, user_id: user_id)&.id)
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

  scope :include_element, -> { includes(:user, :topic, :tagged_articles) }

  # == Callbacks ============================================================
  # Visibility: private for draft articles
  before_save do |article|
    article.visibility = 'only_me' if article.draft?
  end

  # Comments: doesn't allow for private
  before_save do |article|
    article.allow_comment = false if article.visibility == 'only_me'
  end

  # == Class Methods ========================================================
  def self.as_flat_json(articles, format, **options)
    data = case format
           when 'strict'
             ArticleStrictSerializer.new(articles, **options)
           when 'complete'
             ArticleCompleteSerializer.new(articles, include: [:tracker], includes: [], **options)
           else
             ArticleSampleSerializer.new(articles, include: [:user, :tags], **options)
           end

    data.flat_serializable_hash
  end

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.user_id if user
  end

  def link_path(options = {})
    locale = options[:locale] || 'en'

    route_name = case options[:route_name]
                 when 'edit'
                   'edit_article'
                 else
                   'user_article'
                 end

    params        = { user_slug: self.user.slug, article_slug: self[friendly_id_config.slug_column][locale.to_s].presence || self.slug }

    params[:host] = ENV['WEBSITE_FULL_ADDRESS'] if options[:host]

    Rails.application.routes.url_helpers.send("#{route_name}_#{locale}_#{options[:host] ? 'url' : 'path'}", **params)
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

  def check_dead_links!
    urls = self.content.scan(/<a (.*?)href="(https*:\/\/.*?)"(.*?)>/)
    urls.each do |url|
      part_1, link, part_2 = url

      new_part_1 = part_1
      new_part_2 = part_2

      status = Faraday.head(link).status rescue nil

      if !status || status.to_i >= 400
        if part_1.include?('class="')
          new_part_1 = part_1.gsub('class="', 'class="dead-link ')
        elsif part_2.include?('class="')
          new_part_2 = part_2.gsub('class="', 'class="dead-link ')
        else
          new_part_2 = ' class="dead-link"'
        end
        self.content.gsub!("<a #{part_1}href=\"#{link}\"#{part_2}>", "<a #{new_part_1}href=\"#{link}\"#{new_part_2}>")
      elsif part_1.include?('dead-link') || part_2.include?('dead-link')
        if part_1.include?('dead-link')
          new_part_1 = part_1.gsub('dead-link', '')
        elsif part_2.include?('dead-link')
          new_part_2 = part_2.gsub('dead-link', '')
        end

        self.content.gsub!("<a #{part_1}href=\"#{link}\"#{part_2}>", "<a #{new_part_1}href=\"#{link}\"#{new_part_2}>")
      end
    end

    self.save
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
    if self.title_translations[I18n.locale.to_s].present?
      [
        "#{self.title_translations[I18n.locale.to_s]}__at__#{self.topic&.slug}"
      ]
    else
      [
        "#{self.title}__at__#{self.topic&.slug}"
      ]
    end
  end

  # Called by friendlyId to transform 'at' to @
  def normalize_friendly_id(_string = nil)
    super.gsub('__at__', '@')
  end

  def should_generate_new_friendly_id?
    (self[friendly_id_config.slug_column].nil? || self[friendly_id_config.slug_column][I18n.locale.to_s].nil?) && !send(friendly_id_config.base).nil?
  end

  def mode_translated
    mode_to_tr
  end

  # def strip_content
  #   sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish if self.content
  # end

  # Format content for search (keep only return to lines tags)
  def formatted_content(locale)
    formatted_content = public_content(true, locale)
    return formatted_content unless formatted_content

    # formatted_content = formatted_content.gsub(/<img (.*?)\/?>/im, '')

    # Format returns to line
    formatted_content = formatted_content.gsub(/<br *\/?>/im, '@@').gsub(/\<p\>/im, '@@')
    formatted_content = ActionController::Base.helpers.strip_tags(formatted_content)
    formatted_content = formatted_content.gsub(/@@/im, '<br/>')

    return formatted_content
  end

  def public_content(with_translations = false, locale = nil)
    if with_translations && locale
      if self.content_translations[locale.to_s].present?
        ::Sanitizer.new.remove_secrets(self.content_translations[locale.to_s])
      else
        # Select first content not empty
        ::Sanitizer.new.remove_secrets(self.content_translations.compact&.first&.last)
      end
    elsif with_translations
      self.content_translations.transform_values { |c| ::Sanitizer.new.remove_secrets(c) }
    else
      ::Sanitizer.new.remove_secrets(self.content)
    end
  end

  def private_content?
    self.content&.match?(/<(\w+) class="secret">.*?<\/\1>/im)
  end

  def adapted_content(current_user_id = nil, with_translations = false)
    if private_content? && self.user_id != current_user_id
      public_content(with_translations)
    else
      if with_translations
        self.content_translations
      else
        self.content
      end
    end
  end

  def summary_content(size = 180, strip_html = true, current_user_id = nil)
    adapted_content(current_user_id)&.summary(size, strip_html)
  end

  def tag_names
    self.tags.map(&:name)
  end

  def search_data
    # Only filterable can be used in where options!
    {
      id:              self.id,
      user_id:         self.user_id,
      user_slug:       self.user.slug,
      topic_id:        self.topic_id,
      topic_name:      self.topic&.name,
      topic_slug:      self.topic&.slug,
      tag_ids:         self.tag_ids,
      tag_names:       self.tags.map(&:name),
      tag_slugs:       self.tags.map(&:slug),
      mode:            self.mode,
      mode_translated: mode_translated,
      title:           self.title, # Fetch first translation if title not found in current locale
      content:    formatted_content(I18n.locale.to_s),
      reference:  self.reference,
      languages:  self.languages,
      draft:      self.draft,
      notation:   self.notation,
      priority:   self.priority,
      visibility: self.visibility,
      archived:   self.archived,
      accepted:   self.accepted,
      created_at: self.created_at,
      updated_at: self.updated_at,
      rank:       self.rank,
      popularity: self.popularity,
      slug:       self.slug
    }.merge(inventories)
  end

  def public_share_link
    self.share.public_link if self.share_id
  end

  private

  # Used by tracker to add a custom value
  def custom_popularity(popularity, tracker_count)
    popularity *= self.rank if self.rank.present?

    return popularity, tracker_count
  end

  def add_visit_activity(user_id = nil, parent_id = nil)
    return unless user_id

    user = self.user || User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self, owner: user, params: { topic_id: parent_id&.to_i })
  end

  def inventory_fields
    return unless self.inventory?

    self.topic.inventory_fields.each do |field|
      errors.add(:inventories, I18n.t('activerecord.errors.models.article.required_inventory_field', field: field.name)) if field.required? && self.inventories[field.field_name.underscore].blank?
    end
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
