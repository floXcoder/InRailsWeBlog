# frozen_string_literal: true

class UserProfileSerializer
  include FastJsonapi::ObjectSerializer

  set_type :user

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :locale,
             :slug,
             :avatar_url

  has_one :current_topic, record_type: :topic, serializer: TopicSerializer

  has_many :topics, serializer: TopicSampleSerializer do |object|
    object.topics.includes(:tagged_articles).order('created_at asc')
  end

  has_many :contributed_topics, serializer: TopicSampleSerializer do |object|
    object.contributed_topics.includes(:tagged_articles).order('created_at asc')
  end

  attribute :draft_count do |object|
    object.draft_article_ids.count
  end

  attribute :settings do |object|
    UserSettingSerializer.new(object).serializable_hash[:data][:attributes]
  end
end
