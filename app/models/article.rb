# == Schema Information
#
# Table name: articles
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  topic_id                :integer
#  title                   :string
#  summary                 :text
#  content                 :text             not null
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  language                :string
#  allow_comment           :boolean          default(TRUE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
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

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('article', [:visibility])

  # Strip whitespaces
  auto_strip_attributes :title, :summary, :language

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # == Extensions ===========================================================
  # Voteable model
  acts_as_voteable

  # Versioning
  has_paper_trail on: [:update], only: [:title, :summary, :content, :topic, :language]

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  # SEO
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  searchkick searchable:  [:title, :summary, :content, :reference, :tags],
             word_middle: [:title, :summary, :content],
             suggest:     [:title, :summary],
             highlight:   [:content],
             language:    I18n.locale == :fr ? 'French' : 'English'

  # Comments
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

  has_many :child_relationships,
           autosave:    true,
           class_name:  'ArticleRelationship',
           foreign_key: 'child_id',
           dependent:   :destroy

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

  has_many :activities,
           as:         :trackable,
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
            length: { minimum: CONFIG.article_title_min_length, maximum: CONFIG.article_title_max_length },
            if:     -> { title.present? }
  validates :summary,
            length: { minimum: CONFIG.article_summary_min_length, maximum: CONFIG.article_summary_max_length },
            if:     -> { summary.present? }
  validates :content,
            presence: true,
            length:   { minimum: CONFIG.article_content_min_length, maximum: CONFIG.article_content_max_length }
  validates :notation,
            inclusion: CONFIG.notation_min..CONFIG.notation_max

  validates :visibility,
            presence: true

  validate :prevent_revert_to_draft,
           on: :update

  validate :current_topic_belongs_to_user

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :user_id)',
          user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Article.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :from_topic, -> (topic_slug) {
    where(topic_id: Topic.find_by(slug: topic_slug))
    # includes(:topic).where(topics: { slug: topic_slug }) # Slower ??
  }
  scope :from_topic_id, -> (topic_id = nil) {
    where(topic_id: topic_id)
  }

  scope :with_tags, -> (tag_slugs) { includes(:tags).where(tags: { slug: tag_slugs }) }
  scope :with_parent_tags, -> (parent_tag_slugs) { joins(:tags).where(tagged_articles: { parent: true }, tags: { slug: parent_tag_slugs }) }
  scope :with_child_tags, -> (child_tag_slugs) { joins(:tags).where(tagged_articles: { child: true }, tags: { slug: child_tag_slugs }) }

  scope :published, -> { where(draft: false) }

  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  # == Callbacks ============================================================
  before_create do |article|
    article.visibility = 'only_me' if article.draft?
  end

  # == Class Methods ========================================================
  # Article Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  current_topic_id (current topic id for current user)
  #  page (page number for pagination)
  #  per_page (number of articles per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  tags (array of tags associated with articles)
  #  operator (array of tags associated with articles, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    return { articles: [] } if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string = !query || query.blank? ? '*' : query

    # Fields with boost
    fields = %w[title^10 summary^5 content]

    # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
    misspellings_distance = options[:exact] || query_string.length < 7 ? 0 : 2
    misspellings_retry    = 3

    # Operator type: 'and' or 'or'
    operator = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight     = { tag: '<span class="blog-highlight">' }

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options = options[:where].compact.reject { |_k, v| v.empty? }.map do |key, value|
      if key == :notation
        [
          key,
          value.to_i
        ]
      else
        [key, value]
      end
    end.to_h if options[:where]

    where_options        ||= {}

    where_options[:tags] = { all: options[:tags] } if options[:tags]

    # Aggregations
    aggregations = {
      notation: { where: { notation: { not: 0 } } },
      tags:     {}
    }

    # Boost user articles first
    boost_where            = {}
    boost_where[:user_id]  = options[:current_user_id] if options[:current_user_id]
    boost_where[:topic_id] = options[:current_topic_id] if options[:current_topic_id]

    # Page parameters
    page     = options[:page] ? options[:page] : 1
    per_page = options[:per_page] ? options[:per_page] : CONFIG.per_page

    # Order search
    if options[:order]
      order = if options[:order] == 'id_first'
                { id: :asc }
              elsif options[:order] == 'id_last'
                { id: :desc }
              elsif options[:order] == 'created_first'
                { created_at: :asc }
              elsif options[:order] == 'created_last'
                { created_at: :desc }
              elsif options[:order] == 'updated_first'
                { updated_at: :asc }
              elsif options[:order] == 'updated_last'
                { updated_at: :desc }
              elsif options[:order] == 'rank_first'
                { rank: :asc }
              elsif options[:order] == 'rank_last'
                { rank: :desc }
              elsif options[:order] == 'popularity_first'
                { popularity: :asc }
              elsif options[:order] == 'popularity_last'
                { popularity: :desc }
              end
    end

    # Perform search
    results = Article.search(query_string,
                             fields:       fields,
                             boost_where:  boost_where,
                             highlight:    highlight,
                             match:        :word_middle,
                             misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                             suggest:      true,
                             page:         page,
                             per_page:     per_page,
                             operator:     operator,
                             where:        where_options,
                             order:        order,
                             aggs:         aggregations,
                             includes:     [:user, :tags])

    formatted_aggregations = {}
    results.aggs.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h unless value['buckets'].empty?
    end

    # Track search results
    Article.track_searches(results.records.ids)

    articles = results.records
    articles = articles.includes(:user, :tags)
    articles = articles.order_by(options[:order]) if order

    {
      articles:     articles,
      highlight:    highlight ? Hash[results.with_details.map { |article, details| [article.id, details[:highlight]] }] : [],
      suggestions:  results.suggestions,
      aggregations: formatted_aggregations,
      total_count:  results.total_count,
      total_pages:  results.total_pages
    }
  end

  def self.autocomplete_for(query, options = {})
    return Article.none if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h if options[:where]
    where_options ||= {}

    # Set result limit
    limit = options[:limit] ? options[:limit] : CONFIG.per_page

    # Perform search
    results = Article.search(query_string,
                             fields:       %w[title^3 summary],
                             match:        :word_middle,
                             misspellings: false,
                             load:         false,
                             where:        where_options,
                             limit:        limit)

    return results.map do |article|
      {
        title:   article.title,
        summary: article.summary,
        icon:    'article',
        link:    Rails.application.routes.url_helpers.article_path(article.slug)
      }
    end
  end

  def self.default_visibility(current_user = nil, current_admin = nil)
    if current_admin
      all
    elsif current_user
      everyone_and_user(current_user.id)
    else
      everyone
    end
  end

  def self.filter_by(records, filter, current_user = nil)
    records = records.where(id: filter[:article_ids]) if filter[:article_ids]

    records = records.where(accepted: filter[:accepted]) if filter[:accepted]
    records = records.with_visibility(filter[:visibility]) if filter[:visibility]

    records = records.from_user(filter[:user_slug], current_user&.id) if filter[:user_slug]

    records = records.from_topic(filter[:topic_slug]) if filter[:topic_slug]
    records = records.from_topic_id(filter[:topic_id]) if filter[:topic_id]

    records = records.with_tags(filter[:tag_slugs]) if filter[:tag_slugs]
    records = records.with_parent_tags(filter[:parent_tag_slugs]) if filter[:parent_tag_slugs]
    records = records.with_child_tags(filter[:child_tag_slugs]) if filter[:child_tag_slugs]

    records = records.where(draft: true) if filter[:draft]

    records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

    return records
  end

  def self.order_by(order)
    if order == 'id_first'
      order('id ASC')
    elsif order == 'id_last'
      order('id DESC')
    elsif order == 'created_first'
      order('created_at ASC')
    elsif order == 'created_last'
      order('created_at DESC')
    elsif order == 'updated_first'
      order('updated_at ASC')
    elsif order == 'updated_last'
      order('updated_at DESC')
    elsif order == 'rank_first'
      joins(:tracker).order('rank ASC')
    elsif order == 'rank_last'
      joins(:tracker).order('rank DESC')
    elsif order == 'popularity_first'
      joins(:tracker).order('popularity ASC')
    elsif order == 'popularity_last'
      joins(:tracker).order('popularity DESC')
    else
      all
    end
  end

  def self.as_json(articles, options = {})
    return nil unless articles

    serializer_options = {}

    serializer_options.merge(
      scope:      options.delete(:current_user),
      scope_name: :current_user
    ) if options.has_key?(:current_user)

    serializer_options[articles.is_a?(Article) ? :serializer : :each_serializer] = if options[:sample]
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

  def format_attributes(attributes = {}, current_user = nil)
    # Topic: Add current topic to article
    self.topic_id = attributes[:topic_id] || current_user&.current_topic_id

    # Language: set current locale for now
    self.language   = current_user&.locale || I18n.locale

    # Visibility private mandatory for draft articles
    self.visibility = 'only_me' if attributes[:draft]

    # Sanitization
    unless attributes[:title].nil?
      sanitized_title = Sanitize.fragment(attributes.delete(:title))
      self.slug       = nil if sanitized_title != self.title
      self.title      = sanitized_title
    end

    unless attributes[:summary].nil?
      self.summary = Sanitize.fragment(attributes.delete(:summary))
    end

    unless attributes[:content].nil?
      self.content = sanitize_html(attributes.delete(:content))
    end

    unless attributes[:reference].nil?
      reference_url  = ActionController::Base.helpers.sanitize(attributes.delete(:reference))
      reference_url  = "http://#{reference_url}" if reference_url.present? && reference_url !~ /^https?:\/\//
      self.reference = reference_url
    end

    # Pictures
    if attributes[:pictures].present? && attributes[:pictures].is_a?(Array)
      attributes.delete(:pictures).each do |picture_id|
        self.pictures << Picture.find_by(id: picture_id.to_i) if picture_id.present?
      end
    else
      attributes.delete(:pictures)
    end

    # Tags
    if !attributes[:parent_tags].nil? || !attributes[:child_tags].nil? || !attributes[:tags].nil?
      tagged_article_attributes    = []
      tag_relationships_attributes = []

      if !attributes[:parent_tags].nil? && !attributes[:child_tags].nil?
        parent_tags = Tag.parse_tags(attributes.delete(:parent_tags), current_user&.id)
        parent_tags.map do |tag|
          tagged_article_attributes << {
            tag: tag, user_id: self.user_id, topic_id: self.topic_id, parent: true
          }
        end

        child_tags = Tag.parse_tags(attributes.delete(:child_tags), current_user&.id)
        child_tags.map do |tag|
          tagged_article_attributes << {
            tag: tag, user_id: self.user_id, topic_id: self.topic_id, child: true
          }
        end

        tag_relationships_attributes = parent_tags.map do |parent_tag|
          child_tags.map do |child_tag|
            tag_relationships_attributes << {
              parent: parent_tag, child: child_tag, user_id: self.user_id, topic_id: self.topic_id
            }
          end
        end.flatten
      elsif !attributes[:tags].nil? || !attributes[:parent_tags].nil?
        tags = attributes.delete(:tags) || attributes.delete(:parent_tags)
        Tag.parse_tags(tags, current_user&.id).map do |tag|
          tagged_article_attributes << {
            tag: tag, user_id: self.user_id, topic_id: self.topic_id
          }
        end
      end

      new_tagged_articles = tagged_article_attributes.map do |tagged_article_attribute|
        if self.id
          if (tagged_article = self.tagged_articles.where(tag_id: tagged_article_attribute[:tag].id).first)
            tagged_article.assign_attributes(tagged_article_attribute)
            tagged_article
          else
            self.tagged_articles.build(tagged_article_attribute)
          end
        else
          self.tagged_articles.build(tagged_article_attribute)
        end
      end

      new_tag_relationships = tag_relationships_attributes.map do |tag_relationships_attribute|
        if (tag_relationship = self.tag_relationships.where(tag_relationships_attribute).first)
          tag_relationship.assign_attributes(tag_relationships_attribute)
          tag_relationship
        else
          self.tag_relationships.build(tag_relationships_attribute)
        end
      end

      self.tagged_articles   = new_tagged_articles
      self.tag_relationships = new_tag_relationships
    end

    self.assign_attributes(attributes)
  end

  def default_picture
    default_picture = ''

    picture = if self.pictures_count > 0
                self.pictures.order('priority DESC').first.image.thumb.url
              else
                default_picture
              end

    return AssetManifest.image_path(picture || default_picture)
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
    else
      return self.marked_as_outdated.delete(user)
    end
  end

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? followers.include?(user) : false
  end

  def slug_candidates
    [
      "#{self.title}_at_#{self.user.pseudo}"
    ]
  end

  def normalize_friendly_id(_string = nil)
    super.tr('-', '_').gsub('_at_', '@')
  end

  def strip_content
    sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish
  end

  def public_content
    self.content.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
  end

  def private_content?
    self.content.match?(/<(\w+) class="secret">.*?<\/\1>/im)
  end

  def adapted_content(current_user_id)
    if private_content? && self.user_id != current_user_id
      public_content
    else
      content
    end
  end

  def summary_content(current_user_id = nil)
    adapted_content(current_user_id).summary
  end

  # Sanitize content
  include ActionView::Helpers::SanitizeHelper

  def sanitize_html(html)
    return unless html
    return '' if html.blank?

    # Remove empty beginning block
    html = html.sub(/^<p><br><\/p>/, '')

    html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img], attributes: %w[class href name target src alt center align])

    # Remplace pre by pre > code
    html = html.gsub(/<pre>/i, '<pre><code>')
    html = html.gsub(/<\/pre>/i, '</code></pre>')

    return html
  end

  def search_data
    {
      id:             id,
      user_id:        user_id,
      topic_id:       topic_id,
      topic_name:     topic&.name,
      topic_slug:     topic&.slug,
      title:          title,
      summary:        summary,
      content:        strip_content,
      public_content: public_content,
      reference:      reference,
      draft:          draft,
      language:       language,
      notation:       notation,
      priority:       priority,
      visibility:     visibility,
      archived:       archived,
      accepted:       accepted,
      tags:           tags.pluck(:name),
      created_at:     created_at,
      updated_at:     updated_at,
      rank:           rank,
      popularity:     popularity,
      slug:           slug
    }
  end

  private

  def prevent_revert_to_draft
    if self.everyone? && draft_changed? && !draft_was
      errors.add(:base, I18n.t('activerecord.errors.models.article.prevent_revert_to_draft'))
    end
  end

  def current_topic_belongs_to_user
    if self.topic_id.present? && self.topic_id_changed?
      unless self.user.topics.exists?(self.topic_id)
        errors.add(:topic, I18n.t('activerecord.errors.models.article.bad_topic_owner'))
      end
    end
  end

end
