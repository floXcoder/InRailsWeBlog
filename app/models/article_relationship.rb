class ArticleRelationship < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :parent, class_name: 'Article', foreign_key: 'parent_id'
  belongs_to :child, class_name: 'Article', foreign_key: 'child_id'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :parent_id, presence: true, on: :update
  validates :child_id, presence: true, on: :update

  validates_uniqueness_of :parent_id, scope: [:user_id, :child_id], allow_nil: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
