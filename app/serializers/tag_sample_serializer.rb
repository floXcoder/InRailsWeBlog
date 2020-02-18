# frozen_string_literal: true

class TagSampleSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :tag

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :name,
             :synonyms,
             :visibility,
             :tagged_articles_count,
             :slug

  attribute :description do |object|
    object.description&.summary
  end
end
