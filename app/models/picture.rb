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

class Picture < ApplicationRecord

  # == Attributes ===========================================================
  auto_strip_attributes :description, :copyright

  # == Extensions ===========================================================
  mount_uploader :image, PictureUploader
  store_in_background :image

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :imageable, polymorphic: true

  # == Validations ==========================================================
  validates :imageable_type, presence: true

  validates_integrity_of :image
  validates_processing_of :image

  validate :image_size

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  private

  def image_size
    if image.size > CONFIG.image_size
      errors.add(:image, I18n.t('activerecord.errors.models.picture.image_size'))
    end
  end

end
