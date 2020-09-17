# frozen_string_literal: true

class UploadSerializer
  include FastJsonapi::ObjectSerializer

  set_key_transform :camel_lower

  attributes :id,
             :description,
             :copyright

  attribute :url do |object|
    object.image.url
  end

  attribute :medium_url do |object|
    object.image&.medium&.url
  end

  attribute :mini_url do |object|
    object.image&.mini&.url
  end

  attribute :filename do |object|
    object.original_filename
  end
end
