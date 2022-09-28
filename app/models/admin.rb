# frozen_string_literal: true

# == Schema Information
#
# Table name: admins
#
#  id                     :bigint           not null, primary key
#  pseudo                 :string           default(""), not null
#  additional_info        :string
#  locale                 :string           default("en")
#  settings               :jsonb            not null
#  slug                   :string
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
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class Admin < ApplicationRecord

  # == Attributes ===========================================================
  attr_accessor :login
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         :lockable,
         authentication_keys: [:login]

  # # Store settings
  # include Storext.model
  # store_attributes :settings do
  # end

  # == Extensions ===========================================================
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # == Relationships ========================================================
  has_many :blogs, class_name: 'Admin::Blog'

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: InRailsWeBlog.settings.user_pseudo_min_length, maximum: InRailsWeBlog.settings.user_pseudo_max_length }
  validates :email,
            length: { minimum: InRailsWeBlog.settings.user_email_min_length, maximum: InRailsWeBlog.settings.user_email_max_length }

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  def self.pseudo?(pseudo)
    Admin.exists?(['lower(pseudo) = ?', pseudo.mb_chars.downcase.to_s])
  end

  def self.email?(email)
    Admin.exists?(['lower(email) = ?', email.mb_chars.downcase.to_s])
  end

  def self.login?(login)
    Admin.pseudo?(login) || Admin.email?(login)
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
  def admin?(admin)
    admin.id == self.id
  end

  ### Friendly Id
  def slug_candidates
    [
      :pseudo
    ]
  end

end
