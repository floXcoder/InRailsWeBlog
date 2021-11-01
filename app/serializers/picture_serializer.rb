# frozen_string_literal: true

# == Schema Information
#
# Table name: pictures
#
#  id                 :bigint           not null, primary key
#  user_id            :bigint           not null
#  imageable_id       :integer
#  imageable_type     :string           not null
#  image              :string
#  image_tmp          :string
#  description        :text
#  copyright          :string
#  original_filename  :string
#  image_secure_token :string
#  priority           :integer          default(0), not null
#  accepted           :boolean          default(TRUE), not null
#  deleted_at         :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class PictureSerializer
  include FastJsonapi::ObjectSerializer

  extend SerializerHelper

  cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

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
    object.image&.file&.filename
  end

  attribute :dimension do |object|
    object.image&.file&.size
  end
end
