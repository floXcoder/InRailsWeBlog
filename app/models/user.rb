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
#  locale                 :string           default("en")
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
         # :confirmable,
         authentication_keys: [:login]

  include EnumsConcern
  enum :visibility, VISIBILITY
  enums_to_tr('user', [:visibility])

  # Store settings
  store :settings,
        accessors: [
                     :articles_loader, # Load articles by: all / paginate / infinite, default: 'infinite'
                     :article_display, # Display articles: summary / card / inline / grid, default: 'summary'
                     :article_order, # Order articles by: priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, tag_asc, tags_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default, default: 'updated_desc'
                     :article_multilanguage, # Write articles in multi-language, default: false

                     :tag_sidebar_pin, # Tag sidebar pinned by default, default: true
                     :tag_sidebar_with_child, # Display child only tags in sidebar, default: false
                     :tag_order, # Order tags by: name, priority_asc, priority_desc, id_asc, id_desc, created_asc, created_desc, updated_asc, updated_desc, rank_asc, rank_desc, popularity_asc, popularity_desc, default, default: 'name'
                     :tag_parent_and_child, # Display child articles for parent tag, default: true

                     :search_display, # Display view for search results: card / grid, default: 'card'
                     :search_highlight, # Highlight terms in search results, default: true
                     :search_operator, # Search mode for multi-terms: and / or, default: 'and'
                     :search_exact # Search for exact terms, default: true
                   ],
        coder:     JSON

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
  acts_as_tracked :queries, :visits, :views, :clicks

  # Nice url format
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # JSON data serializer
  include DataSerializerConcern
  data_serializer :serialized_data

  # Voter
  include ActAsVoterConcern
  # acts_as_voter

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :current_topic,
             class_name: 'Topic',
             optional:   true

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

  has_many :topics,
           dependent: :destroy

  has_many :articles,
           dependent: :destroy

  has_many :draft_articles,
           -> { where draft: true },
           class_name: 'Article'

  has_many :article_relationships,
           class_name: 'Article::Relationship',
           dependent:  :destroy

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

  has_many :uploads,
           class_name: 'Picture',
           dependent:  :destroy

  has_many :visits,
           class_name: 'Ahoy::Visit'

  has_many :events,
           class_name: 'Ahoy::Event'

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false, conditions: -> { with_deleted } },
            length:     { minimum: InRailsWeBlog.settings.user_pseudo_min_length, maximum: InRailsWeBlog.settings.user_pseudo_max_length }
  validates :email,
            presence:   true,
            uniqueness: { conditions: -> { with_deleted } },
            length:     { minimum: InRailsWeBlog.settings.user_email_min_length, maximum: InRailsWeBlog.settings.user_email_max_length }

  # == Scopes ===============================================================
  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  scope :include_collection, -> { includes(:picture) }

  # == Callbacks ============================================================
  before_create :define_default_settings

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
      joins(:tracker).order('rank ASC NULLS LAST')
    when 'rank_desc'
      joins(:tracker).order('rank DESC NULLS LAST')
    when 'popularity_asc'
      joins(:tracker).order('popularity ASC NULLS LAST')
    when 'popularity_desc'
      joins(:tracker).order('popularity DESC NULLS LAST')
    else
      all
    end
  end

  def self.pseudo?(pseudo)
    User.with_deleted.exists?(['lower(pseudo) = ?', pseudo.mb_chars.downcase.to_s])
  end

  def self.email?(email)
    User.with_deleted.exists?(['lower(email) = ?', email.mb_chars.downcase.to_s])
  end

  def self.login?(login)
    User.with_deleted.pseudo?(login) || User.with_deleted.email?(login)
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

  def self.serialized_data(data, format, **options)
    case format
    when 'strict'
      UserSerializer.new(data,
                         fields:  {
                           user: %i[id pseudo avatarUrl slug date link]
                         },
                         include: [],
                         **options)
    when 'profile'
      UserSerializer.new(data,
                         fields:  {
                           user:  %i[id current_topic topics contributed_topics pseudo email firstName lastName locale slug avatarUrl settings],
                           topic: %i[id userId mode name description priority visibility languages slug tagIds settings]
                         },
                         include: %i[current_topic topics contributed_topics],
                         **options)
    when 'complete'
      UserSerializer.new(data,
                         fields: {
                           topic: %i[id userId mode name description priority visibility languages slug tagIds]
                         },
                         **options)
    else
      UserSerializer.new(data, {
        fields:  {
          user: %i[id pseudo avatarUrl slug]
        },
        include: %i[],
        **options
      })
    end
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.id == user.id if user
  end

  def link_path(options = {})
    locale = options[:locale] || 'en'

    route_name = case options[:route_name].to_s
                 when 'edit'
                   'edit_user'
                 when 'index'
                   'user_articles'
                 else
                   'show_user'
                 end

    params        = { user_slug: self.slug }

    params[:host] = ENV['WEBSITE_URL'] if options[:host]

    Rails.application.routes.url_helpers.send("#{route_name}_#{locale}_#{options[:host] ? 'url' : 'path'}", **params)
  end

  def avatar_url
    self.pictures_count > 0 ? AssetManifest.image_path(self.picture&.image&.url(:mini)) : nil
  end

  def switch_topic(new_topic)
    if self.current_topic_id == new_topic.id
      return new_topic
    elsif self.id != new_topic.user_id && self.contributed_topic_ids.exclude?(new_topic.id)
      self.errors.add(:topic, I18n.t('activerecord.errors.models.topic.not_owner'))
      return false
    else
      self.current_topic_id = new_topic.id
      return true
    end
  end

  # Activities
  def recent_visits(limit = 12)
    article_ids = self.events.recent_articles(limit).map { |event| event.properties['article_id'] }.uniq

    tag_ids = self.events.recent_tags(limit).map { |event| event.properties['tag_id'] }.uniq

    return article_ids, tag_ids
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

    case model_name.classify
    when 'User'
      return following_users.include?(related_object)
    when 'Article'
      return following_articles.include?(related_object)
    when 'Tag'
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
      pseudo:          self.pseudo,
      first_name:      self.first_name,
      last_name:       self.last_name,
      additional_info: Sanitize.fragment(self.additional_info),
      street:          self.street,
      city:            self.city,
      postcode:        self.postcode,
      state:           self.state,
      country:         self.country,
      phone_number:    self.phone_number,
      mobile_number:   self.mobile_number,
      created_at:      self.created_at,
      updated_at:      self.updated_at,
      slug:            self.slug
    }
  end

  private

  def define_default_settings
    self.articles_loader       ||= 'infinite'
    self.article_display       ||= 'summary'
    self.article_order         ||= 'updated_desc'
    self.article_multilanguage ||= false

    self.tag_sidebar_pin        ||= true
    self.tag_sidebar_with_child ||= false
    self.tag_order              ||= 'name'
    self.tag_parent_and_child   ||= true

    self.search_display   ||= 'card'
    self.search_highlight ||= true
    self.search_operator  ||= 'and'
    self.search_exact     ||= true
  end

  def create_default_topic
    default_topic = self.topics.create(name: I18n.t('topic.default_name'), languages: [self.locale], visibility: :only_me)

    update_column(:current_topic_id, default_topic.id)
  end

end
