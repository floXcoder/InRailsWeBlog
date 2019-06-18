# frozen_string_literal: true

class UserProfileSerializer < ActiveModel::Serializer
  # cache key: 'user_profile', expires_in: InRailsWeBlog.config.cache_time

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

  has_one :current_topic, serializer: TopicSerializer

  has_many :topics, serializer: TopicSampleSerializer

  has_many :contributed_topics, serializer: TopicSampleSerializer

  def articles_count
    object.articles.size
  end

  def draft_count
    object.draft_articles.size
  end
end
