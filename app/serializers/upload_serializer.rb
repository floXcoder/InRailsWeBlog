# frozen_string_literal: true

class UploadSerializer
  include FastJsonapi::ObjectSerializer

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :description,
             :copyright

  attribute :url do |object|
    AssetManifest.image_path(object.image.url)
  end

  attribute :medium_url do |object|
    AssetManifest.image_path(object.image&.medium&.url)
  end

  attribute :mini_url do |object|
    AssetManifest.image_path(object.image&.mini&.url)
  end

  attribute :filename do |object|
    object.original_filename
  end
end
