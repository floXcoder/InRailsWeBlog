class TopicSampleSerializer < ActiveModel::Serializer
  cache key: 'topic_sample', expires_in: 12.hours

  include NullAttributesRemover

  attributes :id,
             :user_id,
             :name,
             :description,
             :priority,
             :visibility,
             :slug
end
