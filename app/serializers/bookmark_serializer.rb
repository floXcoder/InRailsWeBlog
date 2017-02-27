class BookmarkSerializer < ActiveModel::Serializer
  cache key: 'bookmark', expires_in: 12.hours

  attributes :id,
             :user_id,
             :bookmarked_id,
             :bookmarked_type,
             :follow
end
