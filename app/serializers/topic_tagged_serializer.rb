class TopicTaggedSerializer < ActiveModel::Serializer
  cache key: 'topic_tagged', expires_in: 12.hours

  attributes :id,
             :user_id,
             :name,
             :description,
             :priority,
             :visibility,
             :slug

  has_many :tags, each_serializer: TagSerializer do
    Tag.includes(:parents, :children).for_user_topic(object.user_id, object.id).order('tags.name')
  end
end
