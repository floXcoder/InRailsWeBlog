# frozen_string_literal: true

class UploadSerializer < ActiveModel::Serializer
  cache key: 'upload', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :url,
             :medium_url,
             :mini_url,
             :filename,
             :description,
             :copyright

  def url
    object.image.url
  end

  def medium_url
    object.image&.medium&.url
  end

  def mini_url
    object.image&.mini&.url
  end

  def filename
    object.original_filename
  end
end
