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

class PictureSerializer < ActiveModel::Serializer
  cache key: 'picture', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :description,
             :copyright,
             :url,
             :medium_url,
             :mini_url,
             :filename,
             :dimension

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
    object.image&.file&.filename
  end

  def dimension
    object.image&.file&.size
  end
end
