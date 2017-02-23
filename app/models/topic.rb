# == Schema Information
#
# Table name: topics
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  name        :string           not null
#  description :text
#  color       :string
#  priority    :integer          default(0), not null
#  visibility  :integer          default(0), not null
#  archived    :boolean          default(FALSE), not null
#  accepted    :boolean          default(TRUE), not null
#  slug        :string
#  deleted_at  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Topic < ApplicationRecord

  # == Attributes ===========================================================
  # Strip whitespaces
  auto_strip_attributes :name, :description

  # == Extensions ===========================================================
  include NiceUrlConcern
  friendly_id :slug_candidates, use: :slugged

  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :user

  has_one :picture,
          as:        :imageable,
          autosave:  true,
          dependent: :destroy
  accepts_nested_attributes_for :picture,
                                allow_destroy: true,
                                reject_if:     lambda {
                                  |picture| picture['picture'].blank? && picture['image_tmp'].blank?
                                }

  # == Validations ==========================================================
  validates :name,
            uniqueness: { scope:          :user_id,
                          case_sensitive: false,
                          message:        I18n.t('activerecord.errors.models.topic.already_exist') },
            allow_nil:  false

  # == Scopes ===============================================================

  # == Callbacks ============================================================

  # == Class Methods ========================================================

  # == Instance Methods =====================================================
  def user?(user)
    user.id == self.user_id if user
  end

  def format_attributes(attributes={})
    # Clean attributes
    attributes = attributes.reject { |_, v| v.blank? }

    # Sanitization
    if attributes[:name].present?
      self.name = Sanitize.fragment(attributes.delete(:name))
    end
    if attributes[:description].present?
      self.description = Sanitize.fragment(attributes.delete(:description))
    end

    # Pictures
    if attributes[:picture].present?
      self.pictures.build(image: attributes.delete(:picture))
    end

    attributes[:pictures] = attributes[:pictures].values if attributes[:pictures].present? && attributes[:pictures].is_a?(Hash)
    if attributes[:pictures].present? && attributes[:pictures].is_a?(Array)
      attributes.delete(:pictures).each do |image|
        self.pictures.build(image: image)
      end
    else
      attributes.delete(:pictures)
    end

    self.assign_attributes(attributes)
  end

  def slug_candidates
    [
      [:name, :id]
    ]
  end
end
