class UserProfileSerializer < ActiveModel::Serializer
  cache key: 'user_profile', expires_in: CONFIG.cache_time

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
             :settings

  has_one :current_topic

  def articles_count
    object.articles.size
  end

  def draft_count
    object.draft_articles.size
  end
end
