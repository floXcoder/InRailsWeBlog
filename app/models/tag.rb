# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ActiveRecord::Base
  # Associations
  has_many :articles, through: :tagged_articles
  has_many :tagged_articles

  has_many :tag_relationships

  has_many :parent_relationship,
           class_name: 'TagRelationship',
           foreign_key: 'parent_id'
  has_many :children,
           through: :parent_relationship,
           source: :child

  has_many :child_relationship,
           class_name: 'TagRelationship',
           foreign_key: 'child_id'
  has_many :parents,
           through: :child_relationship,
           source: :parent



  # Validations
  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false },
            length:   { minimum: 1, maximum: 128 }

end
