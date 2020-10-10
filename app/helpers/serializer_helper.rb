# frozen_string_literal: true

module SerializerHelper
  def record_cache_options(options, fieldset, _includes_list, params)
    return options unless fieldset || params

    options             = options ? options.dup : {}
    options[:namespace] ||= 'serializer'

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
end
