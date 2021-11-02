# frozen_string_literal: true

class UploadSerializer
  include FastJsonapi::ObjectSerializer

  # extend SerializerHelper

  set_key_transform :camel_lower

  # cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :user_id,
             :imageable_id,
             :imageable_type,
             :description,
             :copyright

  attribute :url do |object|
    {
      jpg:  AssetManifest.image_path(object.image.url),
      webp: AssetManifest.image_path(object.image.webp&.url)
    }
  end

  attribute :medium_url do |object|
    {
      jpg:  AssetManifest.image_path(object.image&.medium&.url),
      webp: AssetManifest.image_path(object.image&.medium&.webp&.url)
    }
  end

  attribute :mini_url do |object|
    {
      jpg:  AssetManifest.image_path(object.image&.mini&.url),
      webp: AssetManifest.image_path(object.image&.mini&.webp&.url)
    }
  end
end
