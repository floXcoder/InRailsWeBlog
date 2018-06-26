# == Schema Information
#
# Table name: votes
#
#  id            :bigint(8)        not null, primary key
#  voteable_type :string           not null
#  voteable_id   :bigint(8)        not null
#  voter_type    :string
#  voter_id      :bigint(8)
#  vote          :boolean          default(FALSE), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Vote < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  # include PublicActivity::Model
  # tracked owner: :voter, recipient: :voteable

  # == Relationships ========================================================
  belongs_to :voter,
             polymorphic: true

  belongs_to :voteable,
             polymorphic: true

  # == Validations ==========================================================
  validates :voter,
            presence: true

  validates :voteable,
            presence: true

  # Comment out the line below to allow multiple votes per user.
  validates_uniqueness_of :voteable_id,
                          scope: [:voteable_type, :voter_type, :voter_id],
                          message: I18n.t('activerecord.errors.models.vote.already_voted')

  # == Scopes ===============================================================
  scope :for_voter, lambda { |*args| where(['voter_id = ? AND voter_type = ?', args.first.id, args.first.class.base_class.name]) }

  scope :for_voteable, lambda { |*args| where(['voteable_id = ? AND voteable_type = ?', args.first.id, args.first.class.base_class.name]) }

  scope :recent, lambda { |*args| where(['created_at > ?', (args.first || 2.weeks.ago)]) }

  scope :descending, lambda { order('created_at DESC') }

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
