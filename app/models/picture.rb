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

class Picture < ApplicationRecord

  # == Attributes ===========================================================
  auto_strip_attributes :description, :copyright

  # == Extensions ===========================================================
  mount_uploader :image, PictureUploader

  # Marked as deleted
  acts_as_paranoid
  translation_class.send :acts_as_paranoid rescue nil

  # == Relationships ========================================================
  belongs_to :user,
             counter_cache: true

  belongs_to :imageable,
             polymorphic: true,
             touch: true,
             optional: true,
             counter_cache: true

  # == Validations ==========================================================
  validates :user,
            presence: true

  validates :imageable_type,
            presence: true
  validates_integrity_of :image
  validates_processing_of :image
  validate :image_size

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  def user?(user)
    self.user_id == user.id if user
  end

  def format_attributes(attributes = {})
    # Imageable
    self.imageable_id = attributes.delete(:model_id).to_i if attributes[:model_id].present?
    self.imageable_type = attributes.delete(:model).strip.classify if attributes[:model].present?

    self.description = Sanitize.fragment(attributes.delete(:description)) unless attributes[:description].nil?
    self.copyright = Sanitize.fragment(attributes.delete(:copyright)) unless attributes[:copyright].nil?

    # Pictures
    self.image = attributes.delete(:file) if attributes[:file].present?

    self.assign_attributes(attributes)
  end

  private

  def image_size
    return true if Rails.env.test?

    if image.size.zero?
      errors.add(:image, I18n.t('activerecord.errors.models.picture.no_image'))
    elsif image.size > InRailsWeBlog.settings.image_size
      errors.add(:image, I18n.t('activerecord.errors.models.picture.image_size', size: number_to_human_size(InRailsWeBlog.settings.image_size)))
    end
  end

end
