# frozen_string_literal: true

class TagStrictSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  # cache key: 'tag_strict', expires_in: InRailsWeBlog.config.cache_time

  # Methods with attributes must be overrided to work with searchkick results
  attributes :id,
             :user_id,
             :topic_ids,
             :name,
             :synonyms,
             :date,
             :visibility,
             :slug

  def id
    object.id
  end

  def user_id
    object.user_id
  end

  def topic_ids
    object.topic_ids&.uniq
  end

  def name
    object.name
  end

  def synonyms
    object.synonyms
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
