# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks
#
#  id              :bigint           not null, primary key
#  user_id         :bigint           not null
#  bookmarked_type :string           not null
#  bookmarked_id   :bigint           not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  topic_id        :bigint
#

class BookmarkSerializer
  include FastJsonapi::ObjectSerializer

  # cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :bookmarked_id,
             :bookmarked_type,
             :follow

  attribute :name do |object|
    object.bookmarked.title
  end

  attribute :parent_slug do |object|
    if object.bookmarked.respond_to?(:user)
      object.bookmarked.user.slug
    end
  end

  attribute :slug do |object|
    object.bookmarked.slug
  end
end
