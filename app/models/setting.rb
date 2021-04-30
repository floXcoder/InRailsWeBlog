# frozen_string_literal: true

# == Schema Information
#
# Table name: settings
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  value      :text
#  value_type :integer          default("string_type"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Setting < ApplicationRecord

  # == Attributes ===========================================================
  include EnumsConcern
  enum value_type: VALUE_TYPE

  # == Extensions ===========================================================

  # == Relationships ========================================================

  # == Validations ==========================================================
  validates :name,
            presence: true

  validates :value,
            presence: true

  validates :value_type,
            presence: true

  # == Scopes ===============================================================

  # == Callbacks ============================================================
  after_commit :invalidate_settings_cache

  # == Class Methods ========================================================
  def self.all_settings
    static_settings = Rails.configuration.x

    begin
      cached_settings = Rails.cache.fetch('settings', expires_in: 1.week) do
        vars   = unscoped.select('name, value, value_type')
        result = {}
        vars.each { |record| result[record.name] = convert_value_type(record.value_type, record.value) }
        result.with_indifferent_access
      end
    rescue StandardError => _error
      cached_settings = {}
    end

    OpenStruct.new(static_settings.merge(cached_settings))
  end

  def self.convert_value_type(type, value)
    return value unless value.is_a?(String) || value.is_a?(Integer)

    case type.to_s
    when 'integer_type'
      value.to_i
    when 'float_type' || 'number_type'
      value.to_f
    when 'boolean_type'
      value == 'true' || value == '1' || value == 1 || value == true
    when 'array_type'
      value.split(/[\s,]/).reject(&:empty?)
    when 'hash_type'
      value = YAML.safe_load(value).to_hash rescue {}
      value.deep_stringify_keys!
      value
    else
      value
    end
  end

  # == Instance Methods =====================================================

  private

  def invalidate_settings_cache
    Rails.cache.delete('settings')
  end
end
