# frozen_string_literal: true

module SerializerHelper
  def record_cache_options(options, fieldset, includes_list, params)
    return options unless fieldset || params

    options             = options ? options.dup : {}
    options[:namespace] ||= 'jsonapi-serializer'

    fieldset_key = fieldset ? fieldset.join('_') : ''
    params_key = params ? params.map { |k, v| "#{k}-#{v}" }.join('_') : ''
    cache_key = fieldset_key + params_key

    # Use a fixed-length fieldset key if the current length is more than
    # the length of a SHA1 digest
    if cache_key.length > 40
      cache_key = Digest::SHA1.hexdigest(cache_key)
    end

    options[:namespace] = "#{options[:namespace]}-options:#{cache_key}"
    options
  end
end
