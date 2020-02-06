# frozen_string_literal: true

class UserStrictSerializer
  include FastJsonapi::ObjectSerializer

  set_type :user

  # Cache not available without model object
  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :pseudo,
             :avatar_url,
             :slug

  attribute :date do |object|
    object.created_at.to_i
  end

  attribute :link do |object, params|
    Rails.application.routes.url_helpers.show_user_path(user_slug: object.slug) if params[:with_link]
  end
end
