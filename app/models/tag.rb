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
           class_name:  'TagRelationship',
           foreign_key: 'parent_id'
  has_many :children,
           through: :parent_relationship,
           source:  :child

  has_many :child_relationship,
           class_name:  'TagRelationship',
           foreign_key: 'child_id'
  has_many :parents,
           through: :child_relationship,
           source:  :parent

  # Validations
  validates :tagger_id, presence: true
  validates :name,
            presence:   true,
            uniqueness: { case_sensitive: false },
            length:     { minimum: CONFIG.tag_min_length, maximum: CONFIG.tag_max_length }

  # Nice url format
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  def slug_candidates
    [
      :name
    ]
  end

  # Track activities
  include ActAsTrackedConcern
  acts_as_tracked '_InRailsWeBlog_', :queries, :clicks, :views

  # Follow public activities
  include PublicActivity::Model
  tracked owner: :tagger

  def to_hash
    {
      id: self.id,
      tagger_id: self.tagger_id,
      name: self.name
    }
  end
end
