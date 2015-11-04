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

class TagSerializer < ActiveModel::Serializer
  cache key: 'tag', expires_in: 12.hours

  attributes :id, :tagger_id, :name

  has_many :children, serializer: SimpleTagSerializer

  def name
    object.name.capitalize
  end

end
