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

class TagSampleSerializer < ActiveModel::Serializer
  cache key: 'tag_sample', expires_in: 12.hours

  attributes :id,
             :tagger_id,
             :name,
             :description,
             :synonyms,
             :visibility,
             :tagged_articles_count,
             :slug

  def description
    object.description.summary
  end
end
