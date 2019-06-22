# frozen_string_literal: true

class CommentFullSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  # cache key: 'comment_full', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :title,
             :body,
             :subject,
             :rating,
             :parent_id,
             :nested_level,
             :posted_at,
             :accepted,
             :user,
             :commentable_type,
             :link

  belongs_to :commentable
  belongs_to :user, serializer: UserSampleSerializer

  def nested_level
    object.level
  end

  def posted_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def link
    if object.commentable.is_a?(Article)
      "#{article_path(object.commentable)}#comment-#{object.id}"
    else
      '#'
    end
  end

  def commentable
    if object.commentable.is_a?(Article)
      ArticleSampleSerializer.new(object.commentable, base_url: true).attributes
    else
      object.commentable
    end
  end
end
