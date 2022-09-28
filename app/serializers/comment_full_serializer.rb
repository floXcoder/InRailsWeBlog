# frozen_string_literal: true

class CommentFullSerializer
  include FastJsonapi::ObjectSerializer

  set_type :comment

  # cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.settings.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :title,
             :body,
             :subject,
             :rating,
             :parent_id,
             :accepted,
             :user,
             :commentable_type

  belongs_to :commentable, polymorphic: true

  belongs_to :user, serializer: UserSerializer

  attribute :nested_level do |object|
    object.level
  end

  attribute :posted_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :link do |object|
    if object.commentable.is_a?(Article)
      "#{Rails.application.routes.url_helpers.article_path(object.commentable)}#comment-#{object.id}"
    else
      '#'
    end
  end

  attribute :commentable do |object|
    if object.commentable.is_a?(Article)
      object.commentable.flat_serialized_json
    else
      object.commentable
    end
  end
end
