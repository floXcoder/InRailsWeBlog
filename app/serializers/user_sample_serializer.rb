class UserSampleSerializer < ActiveModel::Serializer
  cache key: 'user_sample', expires_in: CONFIG.cache_time

  attributes :id,
             :pseudo,
             :slug,
             :avatar_url
end
