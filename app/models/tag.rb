# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  tagger_id             :integer          not null
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default(0), not null
#  archived              :boolean          default(FALSE), not null
#  accepted              :boolean          default(TRUE), not null
#  tagged_articles_count :integer          default(0)
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
  auto_strip_attributes :name, :description

  # == Extensions ===========================================================
  # Versioning
  has_paper_trail on: [:update], only: [:name, :description, :synonyms, :priority]

  # Marked as deleted
  acts_as_paranoid

  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :tagger

  # Search
  searchkick searchable:  [:name, :description, :synonyms],
             word_middle: [:name, :description],
             suggest:     [:name],
             highlight:   [:name, :description],
             include:     [:tagger],
             language:    (I18n.locale == :fr) ? 'French' : 'English'

  # == Relationships ========================================================
  belongs_to :tagger,
             class_name: 'User'

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

  has_many :activities, as: :trackable, class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :tagger, presence: true

  validates :name,
            uniqueness: { scope:          :visibility,
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.tag.already_exist') },
            allow_nil:  false,
            if:         -> { visibility == 'everyone' }

  validates :name,
            presence:   true,
            uniqueness: { scope:          :tagger_id,
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.tag.already_exist') },
            length:     { minimum: CONFIG.tag_min_length, maximum: CONFIG.tag_max_length },
            allow_nil:  false,
            if:         -> { visibility != 'everyone' }

  # validates :topics, length: { minimum: 1 }
  # validates :articles, length: { minimum: 1 }

  # == Scopes ===============================================================
  scope :for_user_topic, -> (user_id, topic_id) {
    includes(:tagged_topics).where(tagger_id: user_id, tagged_topics: { topic_id: topic_id })
  }
  scope :everyone_and_user, -> (user_id) {
    where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.tagger_id = :user_id)', user_id: user_id)
  }
  # Works only if all tags are in tagged_topics
  scope :everyone_and_user_and_topic, -> (user_id, topic_id) {
    joins(:tagged_topics).where('tags.visibility = 0 OR (tags.visibility = 1 AND tags.tagger_id = :user_id) OR (tagged_topics.tag_id = tags.id AND tagged_topics.user_id = :user_id AND tagged_topics.topic_id = :topic_id)', user_id: user_id, topic_id: topic_id)
  }

  # Helpers
  scope :most_used, -> (limit = 20) { order('tagged_articles_count desc').limit(limit) }
  scope :least_used, -> (limit = 20) { order('tagged_articles_count asc').limit(limit) }

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
    # If query not defined or blank, search for everything
    query_string          = !query || query.blank? ? '*' : query

    # Fields with boost
    fields                = if I18n.locale == :fr
                              %w(name^10 description)
                            else
                              %w(name^10 description)
                            end

    # Misspelling, specify number of characters
    misspellings_distance = options[:exact] ? 0 : 1

    # Operator type: 'and' or 'or'
    operator              = options[:operator] ? options[:operator] : 'and'

    # Highlight results and select a fragment
    # highlight = options[:highlight] ? {fields: {content: {fragment_size: 200}}, tag: '<span class="blog-highlight">'} : false
    highlight             = { tag: '<span class="blog-highlight">' }

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
    end.to_h

    # Boost user articles first
    boost_where           = options[:current_user_id] ? { tagger_id: options[:current_user_id] } : nil

    # Page parameters
    page                  = options[:page] ? options[:page] : 1
    per_page              = options[:per_page] ? options[:per_page] : CONFIG.per_page

    # Perform search
    results               = Tag.search(query_string,
                                       fields:       fields,
                                       boost_where:  boost_where,
                                       highlight:    highlight,
                                       match:        :word_middle,
                                       misspellings: { edit_distance: misspellings_distance },
                                       suggest:      true,
                                       page:         page,
                                       per_page:     per_page,
                                       operator:     operator,
                                       where:        where_options)

    return Tag.none unless results.any?

    # Track search results
    Tag.track_searches(results.records.ids)

    {
      shops:       results.records,
      highlight:   Hash[results.with_details.map { |tag, details| [tag.id, details[:highlight]] }],
      suggestions: results.suggestions,
      total_count: results.total_count,
      total_pages: results.total_pages
    }
  end

  def self.autocomplete_for(query, options = {})
    return Tag.none if Article.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h

    # Set result limit
    limit         = options[:limit] ? options[:limit] : 10

    # Perform search
    results       = Article.search(query_string,
                                   fields:       %w(name),
                                   match:        :word_middle,
                                   misspellings: { below: 5 },
                                   load:         false,
                                   where:        where_options,
                                   limit:        limit)

    return Tag.none unless results.any?

    return results.records
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
        tagger_id:  current_user_id,
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

  # == Instance Methods =====================================================
  def tagger?(user)
    user.id == tagger.id
  end

  def slug_candidates
    if visibility != 'everyone' && tagger
      [
        [:name, tagger.pseudo]
      ]
    else
      [
        :name
      ]
    end
  end

  def search_data
    {
      tagger_id:   tagger_id,
      name:        name,
      description: description,
      synonyms:    synonyms,
      visibility:  visibility,
      archived:    archived,
      accepted:    accepted
    }
  end

  def to_hash
    {
      id:        self.id,
      tagger_id: self.tagger_id,
      name:      self.name
    }
  end
end
