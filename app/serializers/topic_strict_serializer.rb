# frozen_string_literal: true

class TopicStrictSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :topic

  # Cache not available without model object
  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :mode,
             :name,
             :visibility,
             :languages,
             :slug

  attribute :date do |object|
    object.created_at.to_i
  end

  attribute :user do |object|
    {
      slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug
    }
  end

  attribute :link do |object, params|
    Rails.application.routes.url_helpers.user_topic_path(user_slug: object.user.slug, topic_slug: object.slug) if params[:with_link]
  end
end
