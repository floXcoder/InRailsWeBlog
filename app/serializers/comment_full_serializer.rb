# frozen_string_literal: true

class CommentFullSerializer
  include FastJsonapi::ObjectSerializer

  set_type :comment

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

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

  belongs_to :user, serializer: UserSampleSerializer

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
      ArticleSampleSerializer.new(object.commentable, include: [:user, :tags], params: { base_url: true })
    else
      object.commentable
    end
  end
end
