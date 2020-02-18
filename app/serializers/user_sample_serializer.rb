# frozen_string_literal: true

class UserSampleSerializer
  include FastJsonapi::ObjectSerializer

  set_type :user

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :pseudo,
             :slug,
             :avatar_url
end
