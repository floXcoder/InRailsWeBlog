class UserSampleSerializer < ActiveModel::Serializer
  cache key: 'user_sample', expires_in: 12.hours

  attributes :id,
             :pseudo,
             :slug,
             :avatar_url
end
