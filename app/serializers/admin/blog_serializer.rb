# frozen_string_literal: true

class Admin::BlogSerializer < ActiveModel::Serializer
  cache key: 'admin_blog', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :admin_id,
             :title,
             :content,
             :visibility

end
