# frozen_string_literal: true

class ArticleStrictSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  set_type :article

  # Cache not available without model object
  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  # Methods with attributes must be overrided to work with searchkick results
  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :draft,
             :visibility,
             :current_language,
             :slug,
             :tag_names

  attribute :date do |object|
    object.created_at.to_i
  end

  attribute :user do |object|
    {
      slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug
    }
  end

  attribute :link do |object, params|
    Rails.application.routes.url_helpers.show_article_path(user_slug: object.user.slug, article_slug: object.slug) if params[:with_link]
  end
end
