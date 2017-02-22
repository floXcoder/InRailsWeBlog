# == Schema Information
#
# Table name: votes
#
#  id            :integer          not null, primary key
#  vote          :boolean          default(FALSE), not null
#  voteable_id   :integer          not null
#  voteable_type :string           not null
#  voter_id      :integer
#  voter_type    :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Vote < ActiveRecord::Base

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :voteable, :polymorphic => true
  belongs_to :voter, :polymorphic => true

  # == Validations ==========================================================
  # Comment out the line below to allow multiple votes per user.
  validates_uniqueness_of :voteable_id, :scope => [:voteable_type, :voter_type, :voter_id]

  # == Scopes ===============================================================
  scope :for_voter, lambda { |*args| where(["voter_id = ? AND voter_type = ?", args.first.id, args.first.class.base_class.name]) }
  scope :for_voteable, lambda { |*args| where(["voteable_id = ? AND voteable_type = ?", args.first.id, args.first.class.base_class.name]) }
  scope :recent, lambda { |*args| where(["created_at > ?", (args.first || 2.weeks.ago)]) }
  scope :descending, lambda { order("created_at DESC") }

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
