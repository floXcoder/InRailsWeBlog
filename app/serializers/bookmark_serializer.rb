# == Schema Information
#
# Table name: bookmarks
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  bookmarked_type :string           not null
#  bookmarked_id   :integer          not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class BookmarkSerializer < ActiveModel::Serializer
  cache key: 'bookmark', expires_in: 12.hours

  attributes :id,
             :user_id,
             :bookmarked_id,
             :bookmarked_type,
             :follow
end
