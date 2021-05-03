# frozen_string_literal: true

# == Schema Information
#
# Table name: shares
#
#  id             :bigint           not null, primary key
#  user_id        :bigint           not null
#  shareable_type :string           not null
#  shareable_id   :bigint           not null
#  contributor_id :bigint
#  mode           :integer          default("link"), not null
#  public_link    :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Share < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum mode: SHARE_MODE
  enums_to_tr('share', [:mode])

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :shareable,
             polymorphic: true

  # Only for user share mode
  belongs_to :contributor,
             class_name: 'User',
             optional:   true

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :shareable,
            presence: true

  validates :contributor,
            presence: true,
            unless:   -> { link? }

  validates :mode,
            presence: true

  validates_uniqueness_of :user_id,
                          scope:     [:shareable_id, :shareable_type],
                          if:        -> { link? },
                          allow_nil: false,
                          message:   I18n.t('activerecord.errors.models.share.link_already_shared')

  validates_uniqueness_of :user_id,
                          scope:     [:shareable_id, :shareable_type, :contributor_id],
                          if:        -> { with_user? },
                          allow_nil: false,
                          message:   I18n.t('activerecord.errors.models.share.user_already_shared')

  # == Scopes ===============================================================
  scope :topics, -> { where(shareable_type: 'Topic').includes(:shareable) }
  scope :articles, -> { where(shareable_type: 'Article').includes(:shareable) }

  # == Callbacks ============================================================
  before_save :generate_public_link,
              if: -> { link? }

  # == Class Methods ========================================================
  def self.shared?(user_id, shareable)
    Share.exists?(mode: :link, user_id: user_id, shareable: shareable)
  end

  def self.shared_with?(user_id, shareable, contributor_id)
    Share.exists?(mode: :with_user, user_id: user_id, shareable: shareable, contributor_id: contributor_id)
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def generate_public_link
    loop do
      self.public_link = SecureRandom.uuid
      break unless Share.find_by(public_link: self.public_link)
    end
  end

end
