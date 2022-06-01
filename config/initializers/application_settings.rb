# frozen_string_literal: true

class ApplicationSettings
  def self.all_settings(force_reload: false)
    static_settings = Rails.configuration.x

    begin
      cached_settings = Rails.cache.fetch('settings', expires_in: 1.week, force: force_reload) do
        vars   = Setting.unscoped.select('name, value, value_type')
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
    when 'boolean_type'
      ['true', '1', 1, true].include?(value)
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
end
