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
#  slug                   :string
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

class User < ActiveRecord::Base

  # Associations
  ## Articles
  has_many :articles, class_name: 'Article', foreign_key: 'author_id', dependent: :destroy

  ## Comment
  # has_many :comments, as: :commentable

  ## Picture
  has_one  :picture, as: :imageable, autosave: true, dependent: :destroy
  accepts_nested_attributes_for :picture, allow_destroy: true, reject_if: lambda {
                                            |picture| picture['image'].blank? && picture['image_tmp'].blank?
                                        }

  # Authentification
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

  # Parameters validation
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: 3, maximum: 50 }
  validates :email,     length: { maximum: 128 }

  # Nice url format
  include Shared::NiceUrlConcern
  friendly_id :pseudo,  use: :slugged

  # Preferences
  include Shared::PreferencesConcern

  preference :article_display,    'card'
  preference :multi_language,     'false'
  preference :search_highlight,   'true'
  preference :search_operator,    'and'
  preference :search_exact,       'true'


  def to_s
    "I am #{pseudo}"
  end

  def self.recent(up_to_range, limit = 10)
    User.where(created_at: up_to_range).limit(limit).pluck_to_hash(:id, :created_at, :pseudo)
  end

  def self.pseudo?(pseudo)
    User.where('lower(pseudo) =?', pseudo.downcase).first
  end

  def self.email?(email)
    User.where('lower(email) =?', email.downcase).first
  end

  def self.login?(login)
    true if User.pseudo?(login) || User.email?(login)
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    login = conditions.delete(:login)
    if login
      where(conditions.to_h).where(['lower(pseudo) = :value OR lower(email) = :value', { value: login.downcase }]).first
    else
      where(conditions.to_h).first
    end
  end

end
