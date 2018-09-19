# frozen_string_literal: true

class TopicSampleSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'topic_sample', expires_in: CONFIG.cache_time

  attributes :id,
             :user_id,
             :name,
             :description,
             :priority,
             :visibility,
             :slug
end
