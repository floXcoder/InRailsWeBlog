# == Schema Information
#
# Table name: topics
#
#  id                       :bigint(8)        not null, primary key
#  user_id                  :bigint(8)
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  color                    :string
#  priority                 :integer          default(0), not null
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  pictures_count           :integer          default(0)
#  articles_count           :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class Topic < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('topic', [:visibility])

  include TranslationConcern
  # Add current_language to model
  translates :description,
             auto_strip_translation_fields:    [:description],
             fallbacks_for_empty_translations: true

  # Strip whitespaces
  auto_strip_attributes :name, :color

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description_translations]

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :searches, :clicks, :views, callbacks: { click: :add_visit_activity }

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Search
  searchkick searchable:  [:name, :description],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             language:    -> { I18n.locale == :fr ? 'french' : 'english' }

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             counter_cache: true

  has_one :icon,
          as:         :imageable,
          class_name: 'Picture',
          autosave:   true,
          dependent:  :destroy
  accepts_nested_attributes_for :icon,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['picture'].blank? && picture['image_tmp'].blank?
                                }

  has_many :articles,
           dependent: :destroy

  has_many :tagged_articles,
           dependent: :destroy

  has_many :tag_relationships,
           dependent: :destroy

  has_many :tags,
           through: :tagged_articles

  has_many :bookmarks,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarks,
           source:  :user

  has_many :activities,
           as:         :trackable,
           class_name: 'PublicActivity::Activity'
  has_many :user_activities,
           as:         :recipient,
           class_name: 'PublicActivity::Activity'

  has_many :follower,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarks,
           source:  :user

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            length:     { minimum: CONFIG.topic_name_min_length, maximum: CONFIG.topic_name_max_length }
  validates_uniqueness_of :name,
                          scope: :user_id,
                          conditions: -> { with_deleted },
                          message:        I18n.t('activerecord.errors.models.topic.already_exist')

  validates :description,
            length:    { minimum: CONFIG.topic_description_min_length, maximum: CONFIG.topic_description_max_length },
            allow_nil: true

  validates :languages,
            presence: true,
            if:     -> { description.present? }

  validates :visibility,
            presence: true

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('topics.visibility = 0 OR (topics.visibility = 1 AND topics.user_id = :user_id)',
          user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Topic.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('topics.visibility = 0 OR (topics.visibility = 1 AND topics.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  # == Callbacks ============================================================
  before_create :set_default_color

  after_commit :invalidate_topic_cache

  # == Class Methods ========================================================
  # Article Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  current_topic_id (current topic id for current user)
  #  page (page number for pagination)
  #  per_page (number of topics per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  tags (array of tags associated with topics)
  #  operator (array of tags associated with topics, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    # Format use
    format = options[:format] || 'sample'

    # If query not defined or blank, search for everything
    query_string = !query || query.blank? ? '*' : query

    # Fields with boost
    fields = %w[name^10 description]

    # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
    misspellings_distance = options[:exact] || query_string.length < 7 ? 0 : 2
    misspellings_retry    = 3

    # Operator type: 'and' or 'or'
    operator = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    highlight = false

    # Where options only for ElasticSearch
    where_options = nil

    # # Aggregations
    aggregations = nil

    # Boost user topics first
    boost_where = nil

    # Page parameters
    page     = options[:page] || 1
    per_page = options[:per_page] || Setting.search_per_page

    # Order search
    order = order_search(options[:order])

    # Includes to add when retrieving data from DB
    includes = if format == 'strict'
                 [:user]
               elsif format == 'complete'
                 [:user]
               else
                 [:user]
               end

    # Perform search
    results = Topic.search(query_string,
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
                           execute:      !options[:defer])

    if options[:defer]
      results
    else
      parsed_search(results, format, options[:current_user])
    end
  end

  def self.autocomplete_for(query, options = {})
    # If query not defined or blank, do not search
    query_string = !query || query.blank? ? nil : query

    # Fields with boost
    fields = %w[name^3 description]

    # Where options only for ElasticSearch
    where_options ||= {}

    # Order search
    order = order_search(options[:order])

    # Set result limit
    limit = options[:limit] ? options[:limit] : Setting.per_page

    # Perform search
    results = Topic.search(query_string,
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
      else
        nil
    end
  end

  def self.format_search(topic_results, format, current_user = nil)
    serializer_options                = case format
                                          when 'strict'
                                            {
                                              root:   'topics',
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

    Topic.as_json(topic_results, serializer_options)
  end

  def self.parsed_search(results, format, current_user = nil)
    formatted_aggregations = {}
    results.aggs&.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h if value['buckets'].any?
    end

    # Track search results
    Topic.track_searches(results.map(&:id))

    # Format results into JSON
    topics = format_search(results, format, current_user)

    {
      topics:       topics,
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
    records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

    records = records.where(accepted: filter[:accepted]) if filter[:accepted]
    records = records.with_visibility(filter[:visibility]) if filter[:visibility]

    return records
  end

  def self.order_by(order)
    case order
      when 'id_asc'
        order('id ASC')
      when 'id_desc'
        order('id DESC')
      when 'created_asc'
        order('created_at ASC')
      when 'created_desc'
        order('created_at DESC')
      when 'updated_asc'
        order('updated_at ASC')
      when 'updated_desc'
        order('updated_at DESC')
      else
        all
    end
  end

  def self.as_json(topics, options = {})
    return nil unless topics

    serializer_options = {
      root: topics.is_a?(Topic) ? 'topic' : 'topics'
    }

    serializer_options.merge(scope:      options.delete(:current_user),
                             scope_name: :current_user) if options.has_key?(:current_user)

    serializer_options[topics.is_a?(Topic) ? :serializer : :each_serializer] = if options[:strict]
                                                                                 TopicStrictSerializer
                                                                               elsif options[:sample]
                                                                                 TopicSampleSerializer
                                                                               else
                                                                                 TopicSerializer
                                                                               end

    ActiveModelSerializers::SerializableResource.new(topics, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(topics, options = {})
    return nil unless topics

    as_json(topics, options)[topics.is_a?(Topic) ? :topic : :topics]
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def format_attributes(attributes = {}, current_user = nil)
    current_language = new_language = current_user&.locale || I18n.locale

    # Language
    if self.languages.empty? || attributes[:language].present?
      new_language = (attributes.delete(:language) || current_user&.locale || I18n.locale).to_s
      self.languages |= [new_language]
      I18n.locale = new_language.to_sym if new_language != current_language.to_s
    end

    # Sanitization
    unless attributes[:name].nil?
      sanitized_name = Sanitize.fragment(attributes.delete(:name))
      self.slug      = nil if sanitized_name != self.name
      self.name      = sanitized_name
    end

    unless attributes[:description].nil?
      self.description = Sanitize.fragment(attributes.delete(:description))
    end

    unless attributes[:icon].nil?
      self.build_icon(image: attributes.delete(:icon))
    end

    self.assign_attributes(attributes)
  ensure
    I18n.locale = current_language.to_sym if new_language != current_language.to_s
  end

  def bookmarked?(user)
    user ? user_bookmarks.include?(user) : false
  end

  def followed?(user)
    user ? follower.include?(user) : false
  end

  def slug_candidates
    [
      [:name, :id]
    ]
  end

  def search_data
    {
      id:          id,
      user_id:     user_id,
      name:        name,
      description: description,
      languages:   languages,
      priority:    priority,
      visibility:  visibility,
      archived:    archived,
      accepted:    accepted,
      created_at:  created_at,
      updated_at:  updated_at,
      slug:        slug
    }
  end

  # SEO
  def meta_description
    [self.name, self.description.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def add_visit_activity(user_id = nil, parent_id = nil)
    return unless user_id

    user = User.find_by(id: user_id)
    return unless user

    user.create_activity(:visit, recipient: self)
  end

  def set_default_color
    self.color = Setting.topic_color unless self.color
  end

  def invalidate_topic_cache
    Rails.cache.delete("user_topics:#{self.user_id}")
  end

end
