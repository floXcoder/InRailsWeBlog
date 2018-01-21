# == Schema Information
#
# Table name: tags
#
#  id                       :integer          not null, primary key
#  user_id                  :integer
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  synonyms                 :string           default([]), is an Array
#  color                    :string
#  notation                 :integer          default(0)
#  priority                 :integer          default(0)
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  allow_comment            :boolean          default(TRUE), not null
#  pictures_count           :integer          default(0)
#  tagged_articles_count    :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  comments_count           :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class Tag < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('tag', [:visibility])

  include TranslationConcern
  # Add current_language to model
  translates :description,
             auto_strip_translation_fields:    [:description],
             fallbacks_for_empty_translations: true

  # Strip whitespaces
  auto_strip_attributes :name, :color

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description_translations, :synonyms]

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
  searchkick searchable:  [:name, :description, :synonyms],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             language:    -> { I18n.locale == :fr ? 'french' : 'english' }

  # Comments
  include CommentableConcern

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user,
             class_name:    'User',
             counter_cache: true

  has_many :tagged_articles,
           dependent: :destroy
  has_many :articles,
           through: :tagged_articles
  has_many :topics,
           through: :tagged_articles

  has_many :parent_relationships,
           autosave:    true,
           class_name:  'TagRelationship',
           foreign_key: 'parent_id',
           dependent:   :destroy
  has_many :children,
           through: :parent_relationships,
           source:  :child

  has_many :child_relationships,
           autosave:    true,
           class_name:  'TagRelationship',
           foreign_key: 'child_id',
           dependent:   :destroy
  has_many :parents,
           through: :child_relationships,
           source:  :parent

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

  has_many :activities,
           as:         :trackable,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :name,
            presence: true,
            length:   { minimum: CONFIG.tag_name_min_length, maximum: CONFIG.tag_name_max_length }
  validate :name_visibility
  validate :public_name_immutable,
           on: :update

  validates :description,
            allow_nil: true,
            length:    { minimum: CONFIG.tag_description_min_length, maximum: CONFIG.tag_description_max_length }

  validates :languages,
            presence: true,
            if:     -> { description.present? }

  validates :visibility,
            presence: true
  validate :public_visibility_immutable,
           on: :update

  # == Scopes ===============================================================
  scope :everyone_and_user, -> (user_id = nil) {
    where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :user_id)', user_id: user_id)
  }

  scope :with_visibility, -> (visibility) {
    where(visibility: (visibility.is_a?(String) ? Tag.visibilities[visibility] : visibility))
  }

  scope :from_user, -> (user_id = nil, current_user_id = nil) {
    where(user_id: user_id).where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.user_id = :current_user_id)',
                                  current_user_id: current_user_id)
  }

  scope :for_topic, -> (topic_id) {
    joins(:tagged_articles).merge(TaggedArticle.where(topic_id: topic_id)).distinct
  }

  scope :most_used, -> (limit = 20) { order('tagged_articles_count desc').limit(limit) }
  scope :least_used, -> (limit = 20) { order('tagged_articles_count asc').limit(limit) }

  scope :unused, -> {
    where(tagged_articles_count: 0).where('updated_at < :day', day: 1.day.ago)
  }

  scope :bookmarked_by_user, -> (user_id) {
    joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id })
  }

  # == Callbacks ============================================================
  before_create :set_default_color

  # == Class Methods ========================================================
  # Tag Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  page (page number for pagination)
  #  per_page (number of tags per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  operator (array of tags associated with tags, default: AND)
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

    # Aggregations
    aggregations = nil

    # Boost user tags first
    boost_where = options[:current_user_id] ? { user_id: options[:current_user_id] } : nil

    # Page parameters
    page     = options[:page] ? options[:page] : 1
    per_page = options[:per_page] ? options[:per_page] : Setting.search_per_page

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
    results = Tag.search(query_string,
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
    # If query not defined or blank, search for everything
    query_string = !query || query.blank? ? '*' : query

    # Fields with boost
    fields = %w[name^3 description]

    # Where options only for ElasticSearch
    where_options ||= {}

    # Order search
    order = order_search(options[:order])

    # Set result limit
    limit = options[:limit] ? options[:limit] : Setting.per_page

    # Perform search
    results = Tag.search(query_string,
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
      when 'id_first'
        { id: :asc }
      when 'id_last'
        { id: :desc }
      when 'created_first'
        { created_at: :asc }
      when 'created_last'
        { created_at: :desc }
      when 'updated_first'
        { updated_at: :asc }
      when 'updated_last'
        { updated_at: :desc }
      when 'rank_first'
        { rank: :asc }
      when 'rank_last'
        { rank: :desc }
      when 'popularity_first'
        { popularity: :asc }
      when 'popularity_last'
        { popularity: :desc }
      else
        nil
    end
  end

  def self.format_search(tag_results, format, current_user = nil)
    serializer_options                = case format
                                          when 'strict'
                                            {
                                              root:   'tags',
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

    Tag.as_json(tag_results, serializer_options)
  end

  def self.parsed_search(results, format, current_user = nil)
    formatted_aggregations = {}
    results.aggs&.each do |key, value|
      formatted_aggregations[key] = value['buckets'].map { |data| [data['key'], data['doc_count']] }.to_h if value['buckets'].any?
    end

    # Track search results
    Tag.track_searches(results.map(&:id))

    # Format results into JSON
    tags = format_search(results, format, current_user)

    {
      tags:     tags,
      suggestions:  results.suggestions,
      aggregations: formatted_aggregations,
      total_count:  results.total_count,
      total_pages:  results.total_pages
    }
  end

  def self.order_by(order)
    case order
      when 'id_first'
        order('id ASC')
      when 'id_last'
        order('id DESC')
      when 'created_first'
        order('created_at ASC')
      when 'created_last'
        order('created_at DESC')
      when 'updated_first'
        order('updated_at ASC')
      when 'updated_last'
        order('updated_at DESC')
      when 'rank_first'
        joins(:tracker).order('rank ASC')
      when 'rank_last'
        joins(:tracker).order('rank DESC')
      when 'popularity_first'
        joins(:tracker).order('popularity ASC')
      when 'popularity_last'
        joins(:tracker).order('popularity DESC')
      else
        all
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
    records = records.where(id: filter[:tag_ids]) if filter[:tag_ids]

    records = records.from_user(filter[:user_id]) if filter[:user_id]

    records = records.for_topic(filter[:topic_id]) if filter[:topic_id]

    records = records.bookmarked_by_user(current_user.id) if filter[:bookmarked] && current_user

    records = records.where(accepted: filter[:accepted]) if filter[:accepted]
    records = records.with_visibility(filter[:visibility]) if filter[:visibility]

    return records
  end

  def self.parse_tags(tags, current_user_id)
    return [] unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag_properties|
      name, visibility = if tag_properties.is_a?(String)
                           tag_properties.split(',')
                         else
                           [tag_properties[:name], tag_properties[:visibility]]
                         end

      visibility ||= 'everyone'
      attributes = {
        user_id:    current_user_id,
        name:       Sanitize.fragment(name).mb_chars.capitalize.to_s,
        visibility: Tag.visibilities[visibility]
      }

      Tag.find_by(attributes) || Tag.new(attributes)
    end
  end

  def self.remove_unused_tags(tags)
    return Tag.none unless tags.is_a?(Array) || !tags.empty?

    tags.map do |tag|
      tag.destroy if tag.tagged_articles_count.zero?
    end
  end

  def self.as_json(tags, options = {})
    return nil unless tags

    serializer_options = {
      root: tags.is_a?(Tag) ? 'tag' : 'tags'
    }

    serializer_options.merge(scope:      options.delete(:current_user),
                             scope_name: :current_user) if options.has_key?(:current_user)

    serializer_options[tags.is_a?(Tag) ? :serializer : :each_serializer] = if options[:strict]
                                                                             TagStrictSerializer
                                                                           elsif options[:sample]
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
    self.user_id == user.id if user
  end

  def format_attributes(attributes = {})
    # Clean attributes
    attributes = attributes.reject { |_, v| v.blank? }

    #  Language
    self.languages |= attributes[:language] || current_user&.locale || I18n.locale

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
  end

  def default_picture
    default_picture = ''

    picture = if self.icon
                self.icon.image.thumb.url
              else
                default_picture
              end

    return AssetManifest.image_path(picture || default_picture)
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
      id:                    id,
      user_id:               user_id,
      name:                  name,
      description:           description,
      languages:             languages,
      synonyms:              synonyms,
      notation:              notation,
      priority:              priority,
      visibility:            visibility,
      archived:              archived,
      accepted:              accepted,
      created_at:            created_at,
      updated_at:            updated_at,
      rank:                  rank,
      popularity:            popularity,
      tagged_articles_count: tagged_articles_count,
      slug:                  slug
    }
  end

  # SEO
  def meta_description
    [self.name, self.description.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def name_visibility
    if self.name.present? && name_changed?
      if Tag.where('visibility = 1 AND user_id = :user_id AND lower(name) = :name', user_id: self.user_id, name: self.name.mb_chars.downcase.to_s).any?
        errors.add(:name, I18n.t('activerecord.errors.models.tag.already_exist'))
      elsif Tag.where('visibility = 0 AND lower(name) = :name', name: self.name.mb_chars.downcase.to_s).any?
        errors.add(:name, I18n.t('activerecord.errors.models.tag.already_exist_in_public'))
      end
    end
  end

  def public_name_immutable
    if self.everyone? && name_changed?
      errors.add(:name, I18n.t('activerecord.errors.models.tag.public_name_immutable'))
    end
  end

  def public_visibility_immutable
    if visibility_was == 'everyone' && visibility_changed?
      errors.add(:visibility, I18n.t('activerecord.errors.models.tag.public_visibility_immutable'))
    end
  end

  def set_default_color
    self.color = Setting.tag_color unless self.color
  end

end
