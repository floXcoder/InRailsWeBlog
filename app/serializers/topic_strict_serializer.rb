class TopicStrictSerializer < ActiveModel::Serializer
  cache key: 'topic_strict', expires_in: 12.hours

  include NullAttributesRemover

  # Methods with attributes must be defined to work with searchkick results
  attributes :id,
             :user_id,
             :name,
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

  def visibility
    object.visibility
  end

  def slug
    object.slug
  end
end
