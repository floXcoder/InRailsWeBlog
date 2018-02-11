# == Schema Information
#
# Table name: tag_relationships
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  article_id :integer          not null
#  parent_id  :integer          not null
#  child_id   :integer          not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TagRelationship < ApplicationRecord

  # == Attributes ===========================================================

  # == Extensions ===========================================================
  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user
  belongs_to :topic

  belongs_to :article

  belongs_to :parent,
             class_name: 'Tag',
             foreign_key: 'parent_id'
  belongs_to :child,
             class_name: 'Tag',
             foreign_key: 'child_id'

  # == Validations ==========================================================
  validates :user,
            presence: true
  validates :topic,
            presence: true

  validates :article,
            presence: true

  validates :parent,
            presence: true,
            on: :update
  validates :child,
            presence: true,
            on: :update

  validates_uniqueness_of :topic_id,
                          scope: [:parent_id, :child_id],
                          allow_nil: true,
                          message: I18n.t('activerecord.errors.models.tag_relationship.already_linked')

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

end
