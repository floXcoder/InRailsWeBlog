# frozen_string_literal: true

module SerializerHelper
  def record_cache_options(options, fieldset, _includes_list, params)
    return options unless fieldset || params

    options             = options ? options.dup : {}
    options[:namespace] ||= "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer"

    options[:no_cache] = true if params&.dig(:no_cache)

    fieldset_key = fieldset.present? ? fieldset.join('_') : nil
    params_key = params.present? ? params.map { |k, v| "#{k}-#{v}" }.join('_') : nil
    locale_key = I18n.locale.to_s
    cache_key = [record_type, fieldset_key, params_key, locale_key].compact.join('-')

    # Use a fixed-length fieldset key if the current length is more than the length of a SHA1 digest
    # Actually always digest to avoid invalid characters
    cache_key = Digest::SHA1.hexdigest(cache_key)

    options[:namespace] = "#{options[:namespace]}-options:#{cache_key}"
    options
  end

  class CacheSerializer
    def self.fetch(record_key, **options, &block)
      if (record_key.is_a?(Hash) && record_key['_index'].present?) || options[:no_cache]
        # Change record key if record is from Searchkick
        # record = "#{record['_index']}/#{record['id']}"

        # Do not cache hash (lead to inconsistent results)
        yield block
      else
        Rails.cache.fetch(record_key, **options, &block)
      end
    end
  end
end
