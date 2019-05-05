# frozen_string_literal: true

class TopicStrictSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'topic_strict', expires_in: InRailsWeBlog.config.cache_time

  # Methods with attributes must be overrided to work with searchkick results
  attributes :id,
             :user_id,
             :mode,
             :name,
             :date,
             :visibility,
             :slug

  def id
    object.id
  end

  def user_id
    object.user_id
  end

  def name
    object.name
  end

  def date
    object.created_at.to_i
  end

  def visibility
    object.visibility
  end

  def slug
    object.slug
  end
end
