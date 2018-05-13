class TopicSampleSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'topic_sample', expires_in: 12.hours

  attributes :id,
             :user_id,
             :name,
             :description,
             :priority,
             :visibility,
             :slug
end
