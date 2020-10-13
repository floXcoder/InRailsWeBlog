# frozen_string_literal: true

module SerializerHelper
  def record_cache_options(options, fieldset, _includes_list, params)
    # return options unless fieldset

    options             = options ? options.dup : {}
    options[:namespace] = "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer"

    fieldset_key = fieldset.present? ? fieldset.join('_') : nil
    params_key = params.present? ? params.map { |k, v| "#{k}-#{v}" }.join('_') : nil
    locale_key = I18n.locale.to_s
    cache_key = [fieldset_key, params_key, locale_key].compact.join('-')

    # Use a fixed-length fieldset key if the current length is more than the length of a SHA1 digest
    # Actually always digest to avoid invalid characters
    cache_key = Digest::SHA1.hexdigest(cache_key)

    options[:namespace] = "#{options[:namespace]}-options:#{cache_key}"

    options
  end

  class CacheSerializer
    def self.fetch(record, **options, &block)
      if record.is_a?(Hash) && record['_index'].present?
        # Change record key if record is from Searchkick
        record = "#{record['_index']}/#{record['id']}"
      end

      Rails.cache.fetch(record, **options, &block)
    end
  end
end
