# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  tagger_id  :integer          not null
#  name       :string           not null
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ActiveRecord::Base
  # Associations
  belongs_to :tagger, class_name: 'User'

  def tagger?(user)
    user.id == tagger.id
  end

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
  validates :tagger_id, presence: true
  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false },
            length:   { minimum: 1, maximum: 128 }

  # Nice url format
  include Shared::NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Friendly ID
  def slug_candidates
    [
        :name
    ]
  end

end
