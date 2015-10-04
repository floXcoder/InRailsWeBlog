# == Schema Information
#
# Table name: pictures
#
#  id             :integer          not null, primary key
#  imageable_id   :integer          not null
#  imageable_type :string           not null
#  image          :string
#  image_tmp      :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Picture < ActiveRecord::Base
  # Associations
  belongs_to :imageable, polymorphic: true

  # File properties
  mount_uploader :image, PictureUploader
  store_in_background :image

  # Parameters validation
  validates   :imageable_type,  presence: true
  validate    :image_size

  private

  def image_size
    if image.size > CONFIG.image_size
      errors.add(:image, I18n.t('activerecord.errors.models.picture.image_size'))
    end
  end
end
