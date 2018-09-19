# frozen_string_literal: true

class TagSampleSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'tag_sample', expires_in: CONFIG.cache_time

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
