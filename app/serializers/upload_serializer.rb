class UploadSerializer < ActiveModel::Serializer
  cache key: 'upload', expires_in: 12.hours

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
