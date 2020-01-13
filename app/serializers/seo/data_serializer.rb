# frozen_string_literal: true

class Seo::DataSerializer < ActiveModel::Serializer
  cache key: 'seo_data', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :name,
             :locale,
             :parameters,
             :page_title,
             :meta_desc

end
