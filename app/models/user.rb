# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  street                 :string
#  city                   :string
#  postcode               :string
#  state                  :string
#  country                :string
#  mobile_number          :string
#  phone_number           :string
#  additional_info        :string
#  birth_date             :date
#  locale                 :string           default("fr")
#  settings               :jsonb            not null
#  allow_comment          :boolean          default(TRUE), not null
#  visibility             :integer          default("everyone"), not null
#  current_topic_id       :integer
#  pictures_count         :integer          default(0)
#  topics_count           :integer          default(0)
#  articles_count         :integer          default(0)
#  tags_count             :integer          default(0)
#  bookmarks_count        :integer          default(0)
#  comments_count         :integer          default(0)
#  slug                   :string
#  deleted_at             :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

class User < ApplicationRecord

  # == Attributes ===========================================================
  attr_accessor :login
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         :lockable,
         :confirmable,
         authentication_keys: [:login]

  include EnumsConcern
  enum visibility: VISIBILITY
  enums_to_tr('user', [:visibility])

  # Store settings
  include Storext.model
  store_attributes :settings do
    articles_loader String, default: 'infinite' # Load articles by: all / paginate / infinite
    article_display String, default: 'card' # Display articles: inline / card (with inline edit) / grid
    article_order String, default: 'priority_desc' # Order articles by: priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, tag_asc, tags_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default

    tag_sidebar_pin Boolean, default: true # Tag sidebar pinned by default
    tag_sidebar_with_child Boolean, default: false # Display child only tags in sidebar
    tag_order String, default: 'name' # Order tags by: name, priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default
    tag_parent_and_child Boolean, default: true # Display child articles for parent tag

    search_display Boolean, default: 'card' # Display view for search results: card / grid
    search_highlight Boolean, default: true # Highlight terms in search results
    search_operator String, default: 'and' # Search mode for multi-terms: and / or
    search_exact Boolean, default: true # Search for exact terms
  end

  # Strip whitespaces
  auto_strip_attributes :first_name, :last_name, :city, :country, :additional_info, :phone_number, :mobile_number

  delegate :popularity,
           :rank, :rank=,
           :home_page, :home_page=,
           to: :tracker, allow_nil: true

  # == Extensions ===========================================================
  searchkick searchable:  [:pseudo, :first_name, :last_name, :additional_info, :street, :state, :city, :postcode, :phone_number, :mobile_number],
             word_middle: [:pseudo, :first_name, :last_name, :additional_info, :street, :state, :city, :postcode, :phone_number, :mobile_number],
             suggest:     [:pseudo],
             language:    I18n.locale == :fr ? 'french' : 'english'

  # Track activities
  ## scopes: most_viewed, most_clicked, recently_tracked, populars, home
  include ActAsTrackedConcern
  acts_as_tracked :queries, :clicks, :views

  # Follow public activities
  include PublicActivity::Model

  # Nice url format
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # Voter
  acts_as_voter

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  has_many :topics,
           dependent: :destroy

  has_many :articles,
           dependent: :destroy

  has_many :draft_articles,
           -> { where draft: true },
           class_name: 'Article'

  has_many :article_relationships,
           dependent: :destroy

  has_many :outdated_articles,
           dependent: :destroy

  has_many :tags,
           dependent: :destroy

  has_many :tagged_articles,
           dependent: :destroy

  has_many :tag_relationships,
           dependent: :destroy

  has_many :bookmarks,
           dependent: :destroy
  has_many :bookmarked_articles,
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'Article'
  has_many :followers,
           -> { where(bookmarks: { follow: true }) },
           through: :bookmarks,
           source:  :user
  has_many :following_users,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'User'
  has_many :following_articles,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'Article'
  has_many :following_tags,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'Tag'

  has_many :shares,
           source:    :user,
           dependent: :destroy
  has_many :shared_topics,
           through:     :shares,
           source:      :shareable,
           source_type: 'Topic'
  has_many :shared_articles,
           through:     :shares,
           source:      :shareable,
           source_type: 'Article'

  has_many :contributions,
           class_name:  'Share',
           foreign_key: :contributor_id,
           dependent:   :destroy
  has_many :contributed_topics,
           through:     :contributions,
           source:      :shareable,
           source_type: 'Topic'
  has_many :contributed_articles,
           through:     :contributions,
           source:      :shareable,
           source_type: 'Article'

  has_many :comments,
           dependent: :destroy

  has_many :pictures,
           dependent: :destroy

  has_one :picture,
          as:        :imageable,
          autosave:  true,
          dependent: :destroy
  accepts_nested_attributes_for :picture,
                                allow_destroy: true,
                                reject_if:     lambda { |picture|
                                  picture['image'].blank? &&
                                    picture['image_tmp'].blank? &&
                                    picture['remote_image_url'].blank?
                                }

  has_many :uploads,
           class_name: 'Picture',
           dependent:  :destroy

  has_many :performed_activities,
           as:         :owner,
           class_name: 'PublicActivity::Activity'

  has_many :recent_activities,
           -> { distinct },
           as:         :owner,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: InRailsWeBlog.config.user_pseudo_min_length, maximum: InRailsWeBlog.config.user_pseudo_max_length }
  validates :email,
            presence: true,
            length:   { minimum: InRailsWeBlog.config.user_email_min_length, maximum: InRailsWeBlog.config.user_email_max_length }

  # == Scopes ===============================================================
  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  scope :include_collection, -> { includes(:picture) }

  # == Callbacks ============================================================
  after_create :create_default_topic

  # == Class Methods ========================================================
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
    when 'rank_asc'
      joins(:tracker).order('rank ASC')
    when 'rank_desc'
      joins(:tracker).order('rank DESC')
    when 'popularity_asc'
      joins(:tracker).order('popularity ASC')
    when 'popularity_desc'
      joins(:tracker).order('popularity DESC')
    else
      all
    end
  end

  def self.pseudo?(pseudo)
    User.exists?(['lower(pseudo) = ?', pseudo.mb_chars.downcase.to_s])
  end

  def self.email?(email)
    User.exists?(['lower(email) = ?', email.mb_chars.downcase.to_s])
  end

  def self.login?(login)
    User.pseudo?(login) || User.email?(login)
  end

  def self.find_by_login(login)
    User.where('email = :email OR pseudo = :pseudo', email: login, pseudo: login).first
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    login      = conditions.delete(:login)
    if login
      where(conditions.to_h).where(['lower(pseudo) = :value OR lower(email) = :value', { value: login.mb_chars.downcase.to_s }]).first
    else
      where(conditions.to_h).first
    end
  end

  def self.as_json(users, options = {})
    return nil unless users

    serializer_options = {}

    serializer_options.merge(
      scope:      options.delete(:current_user),
      scope_name: :current_user
    ) if options.key?(:current_user)

    serializer_options[users.is_a?(User) ? :serializer : :each_serializer] = if options[:strict]
                                                                               UserStrictSerializer
                                                                             elsif options[:sample]
                                                                               UserSampleSerializer
                                                                             else
                                                                               UserSerializer
                                                                             end

    ActiveModelSerializers::SerializableResource.new(users, serializer_options.merge(options)).as_json
  end

  def self.as_flat_json(users, options = {})
    return nil unless users

    as_json(users, options)[users.is_a?(User) ? :user : :users]
  end

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.id
  end

  def avatar_url
    self.picture&.image&.url(:mini)
  end

  def current_topic
    Topic.find_by_id(self.current_topic_id) || self.topics.first
  end

  def switch_topic(new_topic)
    if self.current_topic_id == new_topic.id
      return new_topic
    elsif self.id != new_topic.user_id
      self.errors.add(:topic, I18n.t('activerecord.errors.models.topic.not_owner'))
      return false
    else
      self.current_topic_id = new_topic.id
      return true
    end
  end

  # Activities
  def recent_visits(limit = 12)
    last_visits = self.recent_activities.order('activities.created_at DESC').where(key: 'user.visit').where(parameters: { topic_id: self.current_topic_id }).limit(limit)

    return {} if last_visits.empty?

    # Override created_at to use the activity field
    {
      # users:   User.joins(:user_activities).merge(last_visits).distinct,
      # topics:   Topic.joins(:user_activities).merge(last_visits).distinct,
      tags:     Tag.joins(:user_activities).merge(last_visits).select('id', 'user_id', 'name', 'synonyms', 'visibility', 'slug', 'activities.created_at', 'updated_at').distinct,
      articles: Article.includes(:user, :tagged_articles, :tags).joins(:user_activities).merge(last_visits).select('id', 'topic_id', 'mode', 'title_translations', 'summary_translations', 'draft', 'visibility', 'languages', 'slug', 'updated_at', 'activities.created_at').distinct
    }
  end

  ## Bookmarking
  def bookmarkers_count
    user_bookmarked    = User.bookmarked_by_user(self.id).count
    tag_bookmarked     = Tag.bookmarked_by_user(self.id).count
    article_bookmarked = Article.bookmarked_by_user(self.id).count

    user_bookmarked + article_bookmarked + tag_bookmarked
  end

  def following?(model_name, model_id)
    return false unless model_name && model_id

    model_class = model_name.classify.constantize rescue nil
    related_object = model_class.find(model_id)

    return false unless model_class && related_object

    if model_name.classify == 'User'
      return following_users.include?(related_object)
    elsif model_name.classify == 'Article'
      return following_articles.include?(related_object)
    elsif model_name.classify == 'Tag'
      return following_tags.include?(related_object)
    else
      return false
    end
  end

  def slug_candidates
    [
      [:pseudo]
    ]
  end

  def search_data
    {
      pseudo:          pseudo,
      first_name:      first_name,
      last_name:       last_name,
      additional_info: Sanitize.fragment(additional_info),
      street:          street,
      city:            city,
      postcode:        postcode,
      state:           state,
      country:         country,
      phone_number:    phone_number,
      mobile_number:   mobile_number,
      created_at:      created_at,
      updated_at:      updated_at,
      slug:            slug
    }
  end

  # SEO
  def meta_description
    [self.pseudo, self.additional_info.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def create_default_topic
    default_topic = self.topics.create(name: I18n.t('topic.default_name'), languages: [self.locale], visibility: :only_me)

    update_column(:current_topic_id, default_topic.id)
  end

end
