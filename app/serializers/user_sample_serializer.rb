# frozen_string_literal: true

class UserSampleSerializer < ActiveModel::Serializer
  # cache key: 'user_sample', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :pseudo,
             :slug,
             :avatar_url
end
