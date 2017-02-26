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

  store :settings, coder: JSON

  # == Extensions ===========================================================
  include NiceUrlConcern
  friendly_id :pseudo, use: :slugged

  # == Relationships ========================================================

  # == Validations ==========================================================
  validates :pseudo,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: CONFIG.user_pseudo_min_length, maximum: CONFIG.user_pseudo_max_length }
  validates :email,
            length: { minimum: CONFIG.user_email_min_length, maximum: CONFIG.user_email_max_length }

  # == Scopes ===============================================================

  # == Callbacks ============================================================
  # after_create :create_blog

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

  def create_blog
    # admin_blog = Blog.create(admin: self)

    # # Articles for admin pages
    # Blog::Article.create(blog: admin_blog, title: 'Contact', body: '...')
  end

end
