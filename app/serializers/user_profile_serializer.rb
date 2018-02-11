class UserProfileSerializer < ActiveModel::Serializer
  cache key: 'user_profile', expires_in: 12.hours

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :locale,
             :slug,
             :avatar_url,
             :articles_count,
             :draft_count,
             :settings,
             :current_topic

  def articles_count
    object.articles.size
  end

  def draft_count
    object.draft_articles.size
  end

  def current_topic
    TopicSerializer.new(object.current_topic).attributes if object.current_topic
  end
end
