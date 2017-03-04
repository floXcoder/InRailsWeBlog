# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id               :integer
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default("everyone"), not null
#  accepted              :boolean          default(TRUE), not null
#  archived              :boolean          default(FALSE), not null
#  pictures_count        :integer          default(0)
#  tagged_articles_count :integer          default(0)
#  bookmarks_count       :integer          default(0)
#  slug                  :string
#  deleted_at            :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class Tag < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('tag', [:visibility])

  # Strip whitespaces
  auto_strip_attributes :name, :color

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description, :synonyms]

  # Marked as deleted
  acts_as_paranoid

  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # Search
  searchkick searchable:  [:name, :description, :synonyms],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             language:    (I18n.locale == :fr) ? 'French' : 'English'

  # == Relationships ========================================================
  belongs_to :user,
             class_name:    'User',
             counter_cache: true

  has_many :tagged_topics
  has_many :topics,
           through:   :tagged_topics,
           autosave:  true,
           dependent: :destroy

  has_many :tagged_articles
  has_many :articles,
           through: :tagged_articles

  has_many :tag_relationships

  has_many :parent_relationship,
           class_name:  'TagRelationship',
           foreign_key: 'parent_id'
  has_many :children,
           through: :parent_relationship,
           source:  :child

  has_many :child_relationship,
           class_name:  'TagRelationship',
           foreign_key: 'child_id'
  has_many :parents,
           through: :child_relationship,
           source:  :parent

  has_one :picture,
          as:        :imageable,
          autosave:  true,
          dependent: :destroy
  accepts_nested_attributes_for :picture,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['picture'].blank? && picture['image_tmp'].blank?
                                }

  has_many :outdated_articles
  has_many :marked_as_outdated,
           through: :outdated_articles,
           source:  :user

  has_many :bookmarked,
           as:          :bookmarked,
           class_name:  'Bookmark',
           foreign_key: 'bookmarked_id',
           dependent:   :destroy
  has_many :user_bookmarks,
           through: :bookmarked,
           source:  :user

  has_many :follower,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarked,
           source:  :user

  has_many :activities,
           as:         :trackable,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            uniqueness: { scope:          [:visibility, :user_id],
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.tag.already_exist') },
            allow_nil:  false,
            if:         -> { visibility == 'everyone' }
  validates :name,
            presence:   true,
            uniqueness: { scope:          :user_id,
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.tag.already_exist') },
            length:     { minimum: CONFIG.tag_name_min_length, maximum: CONFIG.tag_name_max_length },
            allow_nil:  false,
            if:         -> { visibility != 'everyone' }
  validate :public_name_immutable,
           on: :update

  validates :description,
            length: { minimum: CONFIG.tag_description_min_length, maximum: CONFIG.tag_description_max_length }

  validates :visibility,
            presence: true

  # validates :topics, length: { minimum: 1 }
  # validates :articles, length: { minimum: 1 }

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id) {
    where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :user_id)', user_id: user_id)
  }

  # Works only if all tags are in tagged_topics
  scope :everyone_and_user_and_topic, -> (user_id, topic_id) {
    joins(:tagged_topics).where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :user_id) OR (tagged_topics.tag_id = tags.id AND tagged_topics.user_id = :user_id AND tagged_topics.topic_id = :topic_id)', user_id: user_id, topic_id: topic_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Tag.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('articles.visibility = 0 OR (articles.visibility = 1 AND articles.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :for_user_topic, -> (user_id, topic_id) {
    includes(:tagged_topics).where(user_id: user_id, tagged_topics: { topic_id: topic_id })
  }

  scope :most_used, -> (limit = 20) { order('tagged_articles_count desc').limit(limit) }
  scope :least_used, -> (limit = 20) { order('tagged_articles_count asc').limit(limit) }

  scope :bookmarked_by_user, -> (user_id) {
    joins(:bookmarked).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id })
  }

  scope :unused, -> {
    where(tagged_articles_count: 0).where('updated_at < :day', { day: 1.day.ago })
  }

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  # Tag Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  page (page number for pagination)
  #  per_page (number of articles per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  operator (array of tags associated with articles, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    return { tags: [] } if Tag.count.zero?

    # If query not defined or blank, search for everything
    query_string          = !query || query.blank? ? '*' : query

    # Fields with boost
    fields                = %w(name^10 description)

    # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
    misspellings_distance = options[:exact] || query_string.length < 7 ? 0 : 2
    misspellings_retry    = 3

    # Operator type: 'and' or 'or'
    operator              = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight             = false

    # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
    where_options         = options[:where].compact.reject { |_k, v| v.empty? }.map do |key, value|
      if key == :notation
        [
          key,
          value.to_i
        ]
      else
        [key, value]
      end
    end.to_h if options[:where]

    where_options ||= {}

    # Aggregations
    aggregations  = {
      notation: { where: { notation: { not: 0 } } }
    }

    # Boost user articles first
    boost_where   = options[:current_user_id] ? { user_id: options[:current_user_id] } : nil

    # Page parameters
    page          = options[:page] ? options[:page] : 1
    per_page      = options[:per_page] ? options[:per_page] : CONFIG.per_page

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
    results = Tag.search(query_string,
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
                         includes:     [:user])

    formatted_aggregations = {}
    results.aggs.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h unless value['buckets'].empty?
    end

    # Track search results
    Tag.track_searches(results.records.ids)

    tags = results.records
    tags = tags.includes(:user)
    tags = tags.order_by(options[:order]) if order

    {
      tags:         tags.records,
      highlight:    highlight ? Hash[results.with_details.map { |tag, details| [tag.id, details[:highlight]] }] : [],
      suggestions:  results.suggestions,
      aggregations: formatted_aggregations,
      total_count:  results.total_count,
      total_pages:  results.total_pages
    }
  end

  def self.autocomplete_for(query, options = {})
    return Tag.none if Tag.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h if options[:where]

    # Set result limit
    limit         = options[:limit] ? options[:limit] : CONFIG.per_page

    # Perform search
    results       = Tag.search(query_string,
                               fields:       %w(name^3 description),
                               match:        :word_middle,
                               misspellings: false,
                               load:         false,
                               where:        where_options,
                               limit:        limit)

    return results.map do |tag|
      {
        name:    tag.name,
        summary: tag.summary,
        icon:    'tag',
        link:    Rails.application.routes.url_helpers.tag_path(tag.slug)
      }
    end
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
      self
    end
  end

  def self.parse_tags(tags, current_user_id)
    return Tag.none unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag_properties|
      visibility, name     = tag_properties.split(',')
      default_attributes   = {
        name:       Sanitize.fragment(name).mb_chars.capitalize.to_s,
        visibility: Tag.visibilities[visibility]
      }
      attributes_with_user = {
        user_id:    current_user_id,
        name:       Sanitize.fragment(name).mb_chars.capitalize.to_s,
        visibility: Tag.visibilities[visibility]
      }

      if visibility == 'only_me'
        Tag.find_by(attributes_with_user) || Tag.new(attributes_with_user)
      else
        Tag.find_by(default_attributes) || Tag.new(attributes_with_user)
      end
    end
  end

  def self.remove_unused_tags(tags)
    return Tag.none unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag|
      tag.destroy if tag.tagged_articles_count == 0
    end
  end

  def self.as_json(tags, options = {})
    return nil unless tags

    serializer_options = {}

    serializer_options.merge({
                               scope:      options.delete(:current_user),
                               scope_name: :current_user
                             }) if options.has_key?(:current_user)

    serializer_options[tags.is_a?(Tag) ? :serializer : :each_serializer] = if options[:sample]
                                                                             TagSampleSerializer
                                                                           else
                                                                             TagSerializer
                                                                           end

    ActiveModelSerializers::SerializableResource.new(tags, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(tags, options = {})
    return nil unless tags

    as_json(tags, options)[tags.is_a?(Tag) ? :tag : :tags]
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id
  end

  def format_attributes(attributes = {}, current_user = nil)
    # Clean attributes
    attributes = attributes.reject { |_, v| v.blank? }

    # Sanitization
    unless attributes[:name].nil?
      sanitized_name = Sanitize.fragment(attributes.delete(:name))
      self.slug      = nil if sanitized_name != self.name
      self.name      = sanitized_name
    end

    unless attributes[:description].nil?
      self.references = Sanitize.fragment(attributes.delete(:description))
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
    if visibility != 'everyone' && user
      [
        [:name, user.pseudo]
      ]
    else
      [
        :name
      ]
    end
  end

  def search_data
    {
      id:          id,
      user_id:     user_id,
      name:        name,
      description: description,
      synonyms:    synonyms,
      notation:    notation,
      priority:    priority,
      visibility:  visibility,
      archived:    archived,
      accepted:    accepted,
      created_at:  created_at,
      updated_at:  updated_at,
      rank:        rank,
      popularity:  popularity,
      slug:        slug
    }
  end

  private

  def public_name_immutable
    if name_changed? && self.everyone?
      errors.add(:name, I18n.t('activerecord.errors.models.tag.public_name_immutable'))
    end
  end
end
