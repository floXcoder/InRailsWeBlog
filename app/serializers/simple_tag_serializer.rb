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

class SimpleTagSerializer < ActiveModel::Serializer
  cache key: 'simple_tag', expires_in: 12.hours

  attributes :id, :tagger_id, :name, :slug

end
