# frozen_string_literal: true

class TagStrictSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :tag

  # Cache not available without model object
  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :topic_ids,
             :name,
             :synonyms,
             :visibility,
             :slug

  attribute :date do |object|
    object.created_at.to_i
  end

  attribute :link do |object, params|
    Rails.application.routes.url_helpers.show_tag_path(tag_slug: object.slug) if params[:with_link]
  end
end
