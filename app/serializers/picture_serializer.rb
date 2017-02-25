# == Schema Information
#
# Table name: pictures
#
#  id             :integer          not null, primary key
#  imageable_id   :integer          not null
#  imageable_type :string           not null
#  image          :string
#  image_tmp      :string
#  priority       :integer          default(0), not null
#  accepted       :boolean          default(TRUE), not null
#  deleted_at     :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class PictureSerializer < ActiveModel::Serializer
  cache key: 'picture', expires_in: 12.hours

  attributes :id,
             :description,
             :copyright,
             :url,
             :thumb_url,
             :filename,
             :size,
             :user

  def url
    object.image.url
  end

  def thumb_url
    object.image.thumb.url if object.image&.thumb
  end

  def filename
    object.image.file.filename if object.image&.file
  end

  def size
    object.image.file.size if object.image&.file
  end

  def user
    UserSampleSerializer.new(object.user).attributes
  end
end
