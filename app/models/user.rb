# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
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
    article_display String, default: 'card' # inline/card/edit
    search_highlight Boolean, default: true
    search_operator String, default: 'and' # and/or
    search_exact Boolean, default: true
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
  include ActAsTrackedConcern
  acts_as_tracked :queries, :clicks, :views

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

  has_many :activities,
           as:         :owner,
           class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: CONFIG.user_pseudo_min_length, maximum: CONFIG.user_pseudo_max_length }
  validates :email,
            presence: true,
            length:   { minimum: CONFIG.user_email_min_length, maximum: CONFIG.user_email_max_length }

  # == Scopes ===============================================================
  scope :bookmarked_by_user,
        -> (user_id) { joins(:bookmarks).where(bookmarks: { bookmarked_type: model_name.name, user_id: user_id }) }

  # == Callbacks ============================================================
  after_create :create_default_topic

  # == Class Methods ========================================================
  # Article Search
  # +query+ parameter: string to query
  # +options+ parameter:
  #  current_user_id (current user id)
  #  current_topic_id (current topic id for current user)
  #  page (page number for pagination)
  #  per_page (number of users per page for pagination)
  #  exact (exact search or include misspellings, default: 2)
  #  tags (array of tags associated with users)
  #  operator (array of tags associated with users, default: AND)
  #  highlight (highlight content, default: true)
  #  exact (do not misspelling, default: false, 1 character)
  def self.search_for(query, options = {})
    return { users: [] } if User.count.zero?

    # If query not defined or blank, search for everything
    query_string = !query || query.blank? ? '*' : query

    # Fields with boost
    fields = %w[pseudo]

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

    # Boost user users first
    boost_where = nil

    # Page parameters
    page     = options[:page] ? options[:page] : 1
    per_page = options[:per_page] ? options[:per_page] : Setting.search_per_page

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
    results = User.search(query_string,
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
                          order:        order)

    # Track search results
    User.track_searches(results.records.ids)

    users = results.records
    users = users.order_by(options[:order]) if order

    {
      users:       users,
      highlight:   highlight ? Hash[results.with_details.map { |user, details| [user.id, details[:highlight]] }] : [],
      suggestions: results.suggestions,
      total_count: results.total_count,
      total_pages: results.total_pages
    }
  end

  def self.autocomplete_for(query, options = {})
    return User.none if User.count.zero?

    # If query not defined or blank, search for everything
    query_string  = !query || query.blank? ? '*' : query

    # Where options only for ElasticSearch
    where_options = options[:where].compact.map do |key, value|
      [key, value]
    end.to_h if options[:where]

    # Set result limit
    limit = options[:limit] ? options[:limit] : CONFIG.per_page

    # Perform search
    results = User.search(query_string,
                          fields:       %w[pseudo],
                          match:        :word_middle,
                          misspellings: false,
                          load:         false,
                          where:        where_options,
                          limit:        limit)

    return results.map do |user|
      {
        pseudo: user.pseudo,
        icon:   'user',
        link:   Rails.application.routes.url_helpers.user_path(user.slug)
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
    ) if options.has_key?(:current_user)

    serializer_options[users.is_a?(User) ? :serializer : :each_serializer] = if options[:sample]
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
    self.picture.image.url(:thumb) if self.picture
  end

  def format_attributes(attributes = {})
    # Sanitization
    unless attributes[:first_name].nil?
      attributes[:first_name] = Sanitize.fragment(attributes.delete(:first_name))
    end
    unless attributes[:last_name].nil?
      attributes[:last_name] = Sanitize.fragment(attributes.delete(:last_name))
    end
    unless attributes[:city].nil?
      attributes[:city] = Sanitize.fragment(attributes.delete(:city))
    end
    unless attributes[:additional_info].nil?
      attributes[:additional_info] = Sanitize.fragment(attributes.delete(:additional_info))
    end

    # User picture: take uploaded picture otherwise remote url
    if attributes[:picture_attributes] &&
      attributes[:picture_attributes][:image] &&
      attributes[:picture_attributes][:remote_image_url] &&
      !attributes[:picture_attributes][:remote_image_url].blank?
      attributes[:picture_attributes].delete(:remote_image_url)
    end

    if attributes[:picture_attributes] &&
      !attributes[:picture_attributes][:user_id]
      attributes[:picture_attributes][:user_id] = self.id
    end

    return attributes
  end

  def current_topic
    Topic.find_by_id(self.current_topic_id)
  end

  def switch_topic(new_topic)
    if self.current_topic_id == new_topic.id
      self.errors.add(:topic, I18n.t('activerecord.errors.models.topic.already_selected'))
      return false
    elsif self.id != new_topic.user_id
      self.errors.add(:topic, I18n.t('activerecord.errors.models.topic.not_owner'))
      return false
    else
      update_column(:current_topic_id, new_topic.id)
      return new_topic
    end
  end

  ## Bookmarking
  def bookmarkers_count
    user_bookmarked    = User.bookmarked_by_user(self.id).count
    tag_bookmarked     = Tag.bookmarked_by_user(self.id).count
    article_bookmarked = Article.bookmarked_by_user(self.id).count

    user_bookmarked + article_bookmarked + tag_bookmarked
  end

  def following?(model_name, model_id)
    if model_name && model_id
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
      slug:            slug
    }
  end

  # SEO
  def meta_description
    [self.pseudo, self.additional_info.summary(60)].join(I18n.t('helpers.colon'))
  end

  private

  def create_default_topic
    default_topic = self.topics.create(name: I18n.t('topic.default_name'))
    update_column(:current_topic_id, default_topic.id)
  end

end
