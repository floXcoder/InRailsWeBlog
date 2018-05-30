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
  has_paper_trail on: [:update], only: [:title_translations, :summary_translations, :content_translations, :reference]

  # Track activities
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

  has_many :activities,
           as:         :trackable,
           class_name: 'PublicActivity::Activity'
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
            length: { minimum: CONFIG.article_title_min_length, maximum: CONFIG.article_title_max_length },
            if:     -> { title.present? }
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

  scope :from_user, -> (user_slug, current_user_id = nil) {
    from_user_id(User.find_by(slug: user_slug)&.id, current_user_id)
  }
  scope :from_user_id, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :from_topic, -> (topic_slug) {
    where(topic: Topic.find_by(slug: topic_slug))
    # includes(:topic).where(topics: { slug: topic_slug }) # Slower ??
  }
  scope :from_topic_id, -> (topic_id = nil) {
    where(topic_id: topic_id)
  }

  scope :with_tags, -> (tag_slugs) { left_outer_joins(:tags).where(tags: { slug: tag_slugs }) }
  scope :with_parent_tags, -> (parent_tag_slugs) { joins(:tags).where(tagged_articles: { parent: true }, tags: { slug: parent_tag_slugs }) }
  scope :with_child_tags, -> (child_tag_slugs) { joins(:tags).where(tagged_articles: { child: true }, tags: { slug: child_tag_slugs }) }

  scope :published, -> { where(draft: false) }

  scope :bookmarked_by_user, -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  scope :include_collection, -> { includes(:tags, :tagged_articles, :user_bookmarks, user: [:picture]) }
  scope :include_element, -> { includes(:user, :parent_tags, :child_tags, :tagged_articles, :tracker) }

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
    # Format use
    format = options[:format] || 'sample'

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
    # highlight = options[:highlight] ? { fields: { content: { fragment_size: 10 } }, tag: '<span class="search-highlight">' } : false
    highlight = options[:highlight] ? { tag: '<span class="search-highlight">' } : false

    # Where options only for ElasticSearch
    where_options = where_search(options[:where])

    # Aggregations
    aggregations  = {
      notation: { where: { notation: { not: 0 } } },
      mode:     {},
      tags:     {}
    } if format != 'strict'

    # Boost user articles first
    boost_where            = {}
    boost_where[:user_id]  = options[:current_user_id] if options[:current_user_id]
    boost_where[:topic_id] = options[:current_topic_id] if options[:current_topic_id]

    # Page parameters
    page     = options[:page] || 1
    per_page = options[:per_page] || Setting.search_per_page

    # Order search
    order = order_search(options[:order])

    # Includes to add when retrieving data from DB
    includes = if format == 'strict'
                 [:tags, user: [:picture]]
               elsif format == 'complete'
                 [:tags, user: [:picture]]
               else
                 [:tags, user: [:picture]]
               end

    # Perform search
    results = Article.search(query_string,
                             fields:       fields,
                             highlight:    highlight,
                             boost_where:  boost_where,
                             match:        :word_middle,
                             misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                             suggest:      true,
                             page:         page,
                             per_page:     per_page,
                             operator:     operator,
                             where:        where_options,
                             order:        order,
                             aggs:         aggregations,
                             includes:     includes,
                             # index_name:    %w[articles-fr articles-en],
                             # indices_boost: { "articles-#{I18n.locale}" => 5 },
                             execute: !options[:defer])

    if options[:defer]
      results
    else
      parsed_search(results, format, options[:current_user])
    end
  end

  def self.autocomplete_for(query, options = {})
    # If query not defined or blank, search for everything
    query_string = !query || query.blank? ? nil : query

    # Fields with boost
    fields = %w[title^3 summary]

    # Where options only for ElasticSearch
    where_options = where_search(options[:where])

    # Order search
    order = order_search(options[:order])

    # Set result limit
    limit = options[:limit] ? options[:limit] : Setting.per_page

    # Perform search
    results = Article.search(query_string,
                             fields:       fields,
                             match:        :word_middle,
                             misspellings: false,
                             load:         false,
                             where:        where_options,
                             order:        order,
                             limit:        limit,
                             execute:      !options[:defer])

    if options[:defer]
      results
    else
      format_search(results, 'strict')
    end
  end

  def self.where_search(options)
    options ||= {}

    where_options          = options.compact.reject { |_k, v| v.empty? }.map do |key, value|
      case key
      when :notation
        [
          key,
          value.to_i
        ]
      else
        [key, value]
      end
    end.to_h

    where_options[:tags]   = { all: options[:tags] } if options[:tags]
    where_options[:topics] = { all: options[:topics] } if options[:topics]

    return where_options
  end

  def self.order_search(order)
    return nil unless order

    case order
    when 'id_asc'
      { id: :asc }
    when 'id_desc'
      { id: :desc }
    when 'created_asc'
      { created_at: :asc }
    when 'created_desc'
      { created_at: :desc }
    when 'updated_asc'
      { updated_at: :asc }
    when 'updated_desc'
      { updated_at: :desc }
    when 'rank_asc'
      { rank: :asc }
    when 'rank_desc'
      { rank: :desc }
    when 'popularity_asc'
      { popularity: :asc }
    when 'popularity_desc'
      { popularity: :desc }
    end
  end

  def self.format_search(article_results, format, current_user = nil)
    serializer_options                = case format
                                        when 'strict'
                                          {
                                            root:   'articles',
                                            strict: true
                                          }
                                        when 'complete'
                                          {
                                            complete: true
                                          }
                                        else
                                          {
                                            sample: true
                                          }
                                        end

    serializer_options[:current_user] = current_user if current_user

    Article.as_json(article_results, serializer_options)
  end

  def self.parsed_search(results, format, current_user = nil)
    formatted_aggregations = {}
    results.aggs&.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h if value['buckets'].any?
    end

    # Track search results
    Article.track_searches(results.map(&:id))

    # Format results into JSON
    articles = format_search(results, format, current_user)

    {
      articles:     articles,
      suggestions:  results.suggestions,
      aggregations: formatted_aggregations,
      total_count:  results.total_count,
      total_pages:  results.total_pages
    }
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

    if filter[:bookmarked] && current_user
      records = records.bookmarked_by_user(current_user.id)
    else
      if filter[:user_id]
        records = records.from_user_id(filter[:user_id], current_user&.id)
      elsif filter[:user_slug]
        records = records.from_user(filter[:user_slug], current_user&.id)
      end

      if filter[:topic_id]
        records = records.from_topic_id(filter[:topic_id]) if filter[:topic_id]
      elsif filter[:topic_slug]
        records = records.from_topic(filter[:topic_slug])
      end
    end

    records = if filter[:parent_tag_slug] && filter[:child_tag_slug]
                parent_article_ids = Article.all.includes(:tagged_articles).with_parent_tags(filter[:parent_tag_slug]).ids
                child_article_ids  = Article.all.includes(:tagged_articles).with_child_tags(filter[:child_tag_slug]).ids
                records.where(id: parent_article_ids & child_article_ids)
              elsif filter[:parent_tag_slug]
                records.with_parent_tags(filter[:parent_tag_slug])
              elsif filter[:child_tag_slug]
                records.with_child_tags(filter[:child_tag_slug])
              elsif filter[:tag_slug]
                records.with_tags(filter[:tag_slug])
              else
                records
              end

    records = records.where(draft: true) if filter[:draft]

    records = records.where(mode: filter[:mode]) if filter[:mode]

    return records
  end

  def self.order_by(order)
    case order
    when 'priority_asc'
      order('articles.priority ASC')
    when 'priority_desc'
      order('articles.priority DESC')
    when 'id_asc'
      order('articles.id ASC')
    when 'id_desc'
      order('articles.id DESC')
    when 'created_asc'
      order('articles.created_at ASC')
    when 'created_desc'
      order('articles.created_at DESC')
    when 'updated_asc'
      order('articles.updated_at ASC')
    when 'updated_desc'
      order('articles.updated_at DESC')
    when 'tag_asc'
      order('tags.name ASC')
    when 'tags_desc'
      order('tags.name DESC')
    when 'rank_asc'
      joins(:tracker).order('trackers.rank ASC')
    when 'rank_desc'
      joins(:tracker).order('trackers.rank DESC')
    when 'popularity_asc'
      joins(:tracker).order('trackers.popularity ASC')
    when 'popularity_desc'
      joins(:tracker).order('trackers.popularity DESC')
    else
      all
    end
  end

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

  def format_attributes(attributes = {}, current_user = nil)
    current_language = new_language = current_user&.locale || I18n.locale

    # Topic: Add current topic to article
    if !self.topic_id || attributes[:topic_id].present?
      self.topic_id = attributes[:topic_id] || current_user&.current_topic_id
    end

    # Language
    if self.languages.empty? || attributes[:language].present?
      new_language   = (attributes.delete(:language) || current_user&.locale || I18n.locale).to_s
      self.languages |= [new_language]
    end

    I18n.locale = new_language.to_sym if new_language != current_language.to_s

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

      # Extract all relationship ids
      other_ids             = []
      article_relationships = []
      self.content.scan(/data-article-relation-id="(\d+)"/) { |other_id| other_ids << other_id }

      other_ids.flatten.map do |other_id|
        article_relationships << self.child_relationships.find_or_initialize_by(user: self.user, child: self, parent_id: other_id)
      end

      self.child_relationships = article_relationships
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
    if !attributes[:tags].nil? || !attributes[:parent_tags].nil? || !attributes[:child_tags].nil?
      tagged_article_attributes    = []
      tag_relationships_attributes = []

      if !attributes[:parent_tags].nil? && !attributes[:child_tags].nil?
        # Remove duplicated tags in children if any
        attributes[:child_tags] = attributes[:child_tags].reject do |child|
          attributes[:parent_tags].include?(child)
        end

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
            {
              parent: parent_tag, child: child_tag, user_id: self.user_id, topic_id: self.topic_id
            }
          end
        end.flatten
      else
        tags = [attributes.delete(:parent_tags), attributes.delete(:child_tags), attributes.delete(:tags)].compact.flatten
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
        if (tag_relationship = TagRelationship.where(tag_relationships_attribute).first)
          tag_relationship.assign_attributes(tag_relationships_attribute)
          tag_relationship
        else
          self.tag_relationships.build(tag_relationships_attribute)
        end
      end

      attributes.delete(:parent_tags)
      attributes.delete(:child_tags)
      attributes.delete(:tags)

      self.tagged_articles   = new_tagged_articles
      self.tag_relationships = new_tag_relationships
    end

    self.assign_attributes(attributes)
  ensure
    I18n.locale = current_language.to_sym if new_language != current_language.to_s
  end

  def default_picture
    default_picture = ''

    picture = if self.pictures_count > 0
                # Use sort_by to avoid N+1 queries and new graph model
                self.pictures.sort_by(&:priority).reverse.first.image.mini.url
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
      "#{self.title}_at_#{self.user.pseudo}"
    ]
  end

  def normalize_friendly_id(_string = nil)
    super.tr('-', '_').gsub('_at_', '@')
  end

  def mode_translated
    mode_to_tr
  end

  def strip_content
    sanitize(self.content.gsub(/(<\/\w+>)/i, '\1 '), tags: [], attributes: []).squish if self.content
  end

  def public_content
    self.content&.gsub(/<(\w+) class="secret">(.*?)<\/\1>/im, '')
  end

  def private_content?
    self.content&.match?(/<(\w+) class="secret">.*?<\/\1>/im)
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

    html = sanitize(html, tags: %w[h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img], attributes: %w[class href name target src alt center align data-article-relation-id])

    # Remplace pre by pre > code
    html = html.gsub(/<pre>/i, '<pre><code>')
    html = html.gsub(/<\/pre>/i, '</code></pre>')

    # Improve link security
    html = html.gsub(/<a /i, '<a rel="noopener noreferrer" target="_blank" ')

    return html
  end

  def search_data
    {
      id:               id,
      user_id:          user_id,
      topic_id:         topic_id,
      topic_name:       topic&.name,
      topic_slug:       topic&.slug,
      mode:             mode,
      mode_translated:  mode_translated,
      current_language: current_language,
      title:            title || '', # Title cannot be nil for suggest
      content:    public_content,
      reference:  reference,
      languages:  languages,
      draft:      draft,
      notation:   notation,
      priority:   priority,
      visibility: visibility,
      archived:   archived,
      accepted:   accepted,
      tags:       tags.ids,
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
    [self.title, self.summary.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def add_visit_activity(user_id = nil, parent_id = nil)
    return unless user_id

    user = User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self, params: { topic_id: parent_id })
  end

  def prevent_revert_to_draft
    if self.everyone? && draft_changed? && !draft_was
      errors.add(:base, I18n.t('activerecord.errors.models.article.prevent_revert_to_draft'))
    end
  end

  def current_topic_belongs_to_user
    return unless self.topic_id.present? && self.topic_id_changed?

    unless self.user.topics.exists?(self.topic_id)
      errors.add(:topic, I18n.t('activerecord.errors.models.article.bad_topic_owner'))
    end
  end

end
