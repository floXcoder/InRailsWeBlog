# frozen_string_literal: true

class TopicSampleSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :topic

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :slug
end
