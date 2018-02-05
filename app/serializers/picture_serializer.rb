# == Schema Information
#
# Table name: pictures
#
#  id                 :integer          not null, primary key
#  user_id            :integer          not null
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
  cache key: 'picture', expires_in: 12.hours

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

  # def user
  #   UserSampleSerializer.new(object.user).attributes
  # end
end
