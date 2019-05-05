# == Schema Information
#
# Table name: shares
#
#  id             :bigint           not null, primary key
#  user_id        :bigint           not null
#  shareable_type :string           not null
#  shareable_id   :bigint           not null
#  contributor_id :bigint           not null
#  mode           :integer          default("complete"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Share < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum mode: SHARE_MODE
  enums_to_tr('share', [:mode])

  # == Extensions ===========================================================
  # Follow public activities
  include PublicActivity::Model
  tracked owner: :user, recipient: :contributor, parameters: :shareable

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :shareable,
             polymorphic: true

  belongs_to :contributor,
             class_name: 'User'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :shareable,
            presence: true

  validates :contributor,
            presence: true

  validates :mode,
            presence: true

  validates_uniqueness_of :user_id,
                          scope:     [:shareable_id, :shareable_type, :contributor_id],
                          allow_nil: false,
                          message:   I18n.t('activerecord.errors.models.share.already_shared')

  # == Scopes ===============================================================
  scope :topics, -> { where(shareable_type: 'Topic').includes(:shareable) }
  scope :articles, -> { where(shareable_type: 'Article').includes(:shareable) }

  # == Callbacks ============================================================

  # == Class Methods ========================================================
  def self.shared_with?(user_id, shareable, contributor_id)
    Share.exists?(user_id: user_id, shareable: shareable, contributor_id: contributor_id)
  end

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id
  end

end
