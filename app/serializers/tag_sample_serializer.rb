class TagSampleSerializer < ActiveModel::Serializer
  cache key: 'tag_sample', expires_in: 12.hours

  include NullAttributesRemover

  attributes :id,
             :user_id,
             :name,
             :description,
             :synonyms,
             :visibility,
             :tagged_articles_count,
             :slug

  def description
    object.description&.summary
  end
end
