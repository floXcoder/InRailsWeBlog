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

  has_many :topics, serializer: TopicSampleSerializer

  has_many :contributed_topics, record_type: :topic, serializer: TopicSampleSerializer

  has_many :topics, serializer: TopicSampleSerializer

  attribute :articles_count do |object|
    object.articles.size
  end

  attribute :draft_count do |object|
    object.draft_articles.size
  end

  attribute :settings do |object|
    UserSettingSerializer.new(object).serializable_hash[:data][:attributes]
  end
end
