# frozen_string_literal: true

class Seo::DataSerializer
  include FastJsonapi::ObjectSerializer

  set_type :seo_data

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :name,
             :locale,
             :parameters,
             :page_title,
             :meta_desc

end
