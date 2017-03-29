# == Schema Information
#
# Table name: article_relationships
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  parent_id  :integer          not null
#  child_id   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ArticleRelationship < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================

  # == Relationships ========================================================
  belongs_to :user

  belongs_to :parent,
             class_name: 'Article',
             foreign_key: 'parent_id'
  belongs_to :child,
             class_name: 'Article',
             foreign_key: 'child_id'

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :parent,
            presence: true,
            on: :update
  validates :child,
            presence: true,
            on: :update

  validates_uniqueness_of :parent_id,
                          scope: [:user_id, :child_id],
                          allow_nil: true,
                          message: I18n.t('activerecord.errors.models.article_relationship.already_linked')

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
