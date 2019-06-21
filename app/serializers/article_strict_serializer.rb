# frozen_string_literal: true

class ArticleStrictSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'article_strict', expires_in: InRailsWeBlog.config.cache_time

  # Methods with attributes must be overrided to work with searchkick results
  attributes :id,
             :topic_id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :draft,
             :date,
             :visibility,
             :current_language,
             :slug,
             :user,
             :tag_names

  def id
    object.id
  end

  def topic_id
    object.topic_id
  end

  def mode
    object.mode
  end

  def mode_translated
    object.mode_translated
  end

  def title
    object.title
  end

  def summary
    object.summary
  end

  def draft
    object.draft
  end

  def date
    object.created_at.to_i
  end

  def visibility
    object.visibility
  end

  def current_language
    object.current_language
  end

  def slug
    object.slug
  end

  def user
    {
      slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug
    }
  end

  def tag_names
    object.tag_names
  end
end
