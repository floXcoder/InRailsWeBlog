class UploadSerializer < ActiveModel::Serializer
  cache key: 'upload', expires_in: 12.hours

  attributes :id,
             :url,
             :thumb_url,
             :description,
             :copyright

  def url
    object.image.url
  end

  def thumb_url
    object.image.thumb.url
  end
end
