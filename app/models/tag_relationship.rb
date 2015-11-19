# == Schema Information
#
# Table name: tag_relationships
#
#  id          :integer          not null, primary key
#  parent_id   :integer
#  child_id    :integer
#  article_ids :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class TagRelationship < ActiveRecord::Base
  belongs_to :parent, class_name: 'Tag', foreign_key: 'parent_id'
  belongs_to :child, class_name: 'Tag', foreign_key: 'child_id'

  # Serialized attributes
  serialize :article_ids, Array

  # Parameters validation
  validates :parent_id,  presence: true, on: :update
  validates :child_id,   presence: true, on: :update

  validates_uniqueness_of :parent_id, scope: :child_id, allow_nil: true
end
