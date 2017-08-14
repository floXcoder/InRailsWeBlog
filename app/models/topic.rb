# == Schema Information
#
# Table name: topics
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  name            :string           not null
#  description     :text
#  color           :string
#  priority        :integer          default(0), not null
#  visibility      :integer          default("everyone"), not null
#  accepted        :boolean          default(TRUE), not null
#  archived        :boolean          default(FALSE), not null
#  pictures_count  :integer          default(0)
#  articles_count  :integer          default(0)
#  bookmarks_count :integer          default(0)
#  slug            :string
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Topic < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('topic', [:visibility])

  # Strip whitespaces
  auto_strip_attributes :name, :color

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description]

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
             language:    I18n.locale == :fr ? 'French' : 'English'

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             counter_cache: true

  has_one :picture,
          as:        :imageable,
          autosave:  true,
          dependent: :destroy
  accepts_nested_attributes_for :picture,
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

  # TODO
  # has_many :tags,
  #          through:   :tagged_articles

  has_many :bookmarks,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarks,
           source:  :user

  has_many :follower,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarks,
           source:  :user

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            uniqueness: { scope:          :user_id,
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.topic.already_exist') },
            length:     { minimum: CONFIG.topic_name_min_length, maximum: CONFIG.topic_name_max_length }

  validates :description,
            length:    { minimum: CONFIG.topic_description_min_length, maximum: CONFIG.topic_description_max_length },
            allow_nil: true

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
    return { topics: [] } if Topic.count.zero?

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
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight     = false

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options = options[:where].compact.reject { |_k, v| v.empty? }.map do |key, value|
      [key, value]
    end.to_h if options[:where]

    where_options ||= {}

    # # Aggregations
    # aggregations  = {}

    # Boost user articles first
    boost_where = nil

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
              end
    end

    # Perform search
    results = Topic.search(query_string,
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
                           # aggs:         aggregations,
                           includes: [:user])

    # formatted_aggregations = {}
    # results.aggs.each do |key, value|
    #   formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h unless value['buckets'].empty?
    # end

    # Track search results
    # Topic.track_searches(results.records.ids)

    topics = results.records
    topics = topics.includes(:user)
    topics = topics.order_by(options[:order]) if order

    {
      topics:      topics,
      highlight:   highlight ? Hash[results.with_details.map { |topic, details| [topic.id, details[:highlight]] }] : [],
      suggestions: results.suggestions,
      # aggregations: formatted_aggregations,
      total_count: results.total_count,
      total_pages: results.total_pages
    }
  end

  def self.autocomplete_for(query, options = {})
    return Topic.none if Topic.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h if options[:where]

    # Set result limit
    limit = options[:limit] ? options[:limit] : CONFIG.per_page

    # Perform search
    results = Topic.search(query_string,
                           fields:       %w[name^3 description],
                           match:        :word_middle,
                           misspellings: false,
                           load:         false,
                           where:        where_options,
                           limit:        limit)

    return results.map do |topic|
      {
        name:    topic.name,
        summary: topic.summary,
        icon:    'topic',
        link:    Rails.application.routes.url_helpers.user_topic_path(topic.user_id, topic.slug)
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
    records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

    records = records.where(accepted: filter[:accepted]) if filter[:accepted]
    records = records.with_visibility(filter[:visibility]) if filter[:visibility]

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
    else
      all
    end
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def format_attributes(attributes = {})
    # Clean attributes
    attributes = attributes.reject { |_, v| v.blank? }

    # Sanitization
    unless attributes[:name].nil?
      sanitized_name = Sanitize.fragment(attributes.delete(:name))
      self.slug      = nil if sanitized_name != self.name
      self.name      = sanitized_name
    end

    unless attributes[:description].nil?
      self.description = Sanitize.fragment(attributes.delete(:description))
    end

    unless attributes[:picture].nil?
      self.build_picture(image: attributes.delete(:picture))
    end

    self.assign_attributes(attributes)
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

end
