# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  preferences            :text             default({}), not null
#  last_request           :text             default({}), not null
#  current_topic_id       :integer
#  admin                  :boolean          default(FALSE), not null
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
  # Preferences
  store_accessor :preferences, :article_display, :search_highlight, :search_operator, :search_exact

  # Strip whitespaces
  auto_strip_attributes :first_name, :last_name, :city, :country, :additional_info

  # == Extensions ===========================================================
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

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked :queries, :comments, :clicks, :views

  # Nice url format
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # Voter
  acts_as_voter

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  has_many :topics, dependent: :destroy

  has_many :articles,
           class_name: 'Article',
           dependent:  :destroy

  has_many :temporary_articles,
           -> { where temporary: true },
           class_name: 'Article'

  has_many :tags,
           class_name: 'Tag',
           dependent:  :destroy

  has_many :outdated_articles
  has_many :marked_as_outdated,
           through: :outdated_articles,
           source:  :article

  has_many :bookmarks,
           dependent: :destroy

  has_many :following_user,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'User'
  has_many :following_article,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'Article'
  has_many :following_tag,
           -> { where(bookmarks: { follow: true }) },
           through:     :bookmarks,
           source:      :bookmarked,
           source_type: 'Tag'

  has_many :comments,
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

  has_many :activities, as: :owner, class_name: 'PublicActivity::Activity'

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: 3, maximum: 50 }
  validates :email,
            length: { maximum: 128 }

  # == Scopes ===============================================================

  # == Callbacks ============================================================
  before_create :set_preferences

  after_create :create_default_topic

  # == Class Methods ========================================================
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

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.id
  end

  def avatar
    self.picture.image.url(:thumb) if self.picture
  end

  def current_topic
    Topic.find_by_id(self.current_topic_id)
  end

  def change_current_topic(new_topic)
    if self.current_topic_id == new_topic.id
      new_topic.errors.add(:topic, I18n.t('activerecord.errors.models.topic.already_selected'))
      return false
    else
      update_attribute(:current_topic_id, new_topic.id)
      return new_topic
    end
  end

  ## Bookmarking
  def bookmarked?(model_name, model_id)
    if model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find(model_id)

      return bookmarks.include?(related_object)
    else
      return false
    end
  end

  def bookmarkers_count
    user_bookmarked    = User.where(id: self.id).merge(User.joins(:bookmarked).where(bookmarks: { bookmarked_type: 'User' })).count
    article_bookmarked = Article.where(user_id: self.id).merge(Article.joins(:bookmarked).where(bookmarks: { bookmarked_type: 'Article' })).count
    tag_bookmarked     = Tag.where(user_id: self.id).merge(Tag.joins(:bookmarked).where(bookmarks: { bookmarked_type: 'Tag' })).count

    user_bookmarked + article_bookmarked + tag_bookmarked
  end

  def bookmark(model_name, model_id)
    if model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find(model_id)

      if self.bookmarks.exists?(bookmarked_id: model_id, bookmarked_type: model_name.classify)
        errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.already_bookmarked'))
        return false
      else
        bookmark = related_object.bookmarked.create(user_id: self.id)

        if bookmark.valid?
          return bookmark
        else
          errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
          return false
        end
      end
    else
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
      return false
    end
  end

  def unbookmark(model_name, model_id)
    if model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find(model_id)

      if !self.bookmarks.exists?(bookmarked_id: model_id, bookmarked_type: model_name.classify)
        errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.not_bookmarked'))
        return false
      else
        destroyed_bookmark = related_object.bookmarked.find_by(user_id: self.id).destroy

        if destroyed_bookmark.destroyed?
          return destroyed_bookmark
        else
          errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
          return false
        end
      end
    else
      errors.add(:bookmark, I18n.t('activerecord.errors.models.bookmark.model_unkown'))
      return false
    end
  end

  def following?(model_name, model_id)
    if model_name && model_id
      model_class    = model_name.classify.constantize
      related_object = model_class.find(model_id)

      if model_name.classify == 'User'
        return following_user.include?(related_object)
      elsif model_name.classify == 'Shop'
        return following_shop.include?(related_object)
      else
        return false
      end
    else
      return false
    end
  end

  private

  def create_default_topic
    default_topic = self.topics.create(name: I18n.t('topic.default_name'))
    update_attribute(:current_topic_id, default_topic.id)
  end

  def set_preferences
    self.preferences[:article_display]  = CONFIG.article_display if preferences[:article_display].blank?
    self.preferences[:search_highlight] = CONFIG.search_highlight if preferences[:search_highlight].blank?
    self.preferences[:search_operator]  = CONFIG.search_operator if preferences[:search_operator].blank?
    self.preferences[:search_exact]     = CONFIG.search_exact if preferences[:search_exact].blank?
  end
end
