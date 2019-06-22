# frozen_string_literal: true

# == Schema Information
#
# Table name: topic_inventory_fields
#
#  id              :bigint           not null, primary key
#  topic_id        :bigint
#  name            :string           not null
#  field_name      :string           not null
#  value_type      :integer          default("string_type"), not null
#  parent_category :string
#  required        :boolean          default(FALSE), not null
#  searchable      :boolean          default(FALSE), not null
#  filterable      :boolean          default(FALSE), not null
#  priority        :integer          default(0), not null
#  visibility      :integer          default("everyone"), not null
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Topic::InventoryField < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum value_type: VALUE_TYPE
  enum visibility: VISIBILITY
  enums_to_tr('inventory', [:value_type, :visibility])

  # Strip whitespaces
  auto_strip_attributes :name

  # == Extensions ===========================================================
  # Marked as deleted
  acts_as_paranoid

  # == Relationships ========================================================
  belongs_to :topic

  # == Validations ==========================================================
  validates :topic,
            presence: true

  validates :name,
            presence: true,
            length: { minimum: InRailsWeBlog.config.topic_inventory_field_name_min_length, maximum: InRailsWeBlog.config.topic_inventory_field_name_max_length }
  validates_uniqueness_of :name,
                          scope:      :topic_id,
                          conditions: -> { with_deleted },
                          message:    I18n.t('activerecord.errors.models.inventory_field.already_exist')

  validates :field_name,
            presence: true

  validates :value_type,
            presence: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================
  before_validation :generate_field_name

  # == Class Methods ========================================================

  # == Instance Methods =====================================================

  private

  def generate_field_name
    return unless self.name_changed?

    self.field_name = self.name.to_s.parameterize.underscore
  end

end
