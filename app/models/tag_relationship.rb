# == Schema Information
#
# Table name: tag_relationships
#
#  id          :integer          not null, primary key
#  parent_id   :integer          not null
#  child_id    :integer          not null
#  article_ids :string           not null, is an Array
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class TagRelationship < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :parent, class_name: 'Tag', foreign_key: 'parent_id'
  belongs_to :child, class_name: 'Tag', foreign_key: 'child_id'

  # == Validations ==========================================================
  validates :parent_id, presence: true, on: :update
  validates :child_id, presence: true, on: :update

  validates_uniqueness_of :parent_id, scope: :child_id, allow_nil: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
