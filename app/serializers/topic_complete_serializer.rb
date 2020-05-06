# frozen_string_literal: true

class TopicCompleteSerializer
  include FastJsonapi::ObjectSerializer

  set_type :topic

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :languages,
             :slug,
             :articles_count

  belongs_to :user, serializer: UserSampleSerializer

  has_many :tags, serializer: TagSerializer do |object|
    Tag.includes(:parents, :children, :tagged_articles, :child_relationships).for_topic_id(object.id).order('tags.priority', 'tags.name')
  end

  has_many :contributors, record_type: :user, serializer: UserStrictSerializer

  has_one :tracker

  attribute :description_translations do |object|
    object.description_translations
  end

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :created_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :settings do |object|
    UserSettingSerializer.new(object).serializable_hash[:data][:attributes].compact
  end

  attribute :inventory_fields do |object|
    Topic::InventoryFieldSerializer.new(object.inventory_fields).serializable_hash&.dig(:data)&.map { |d| d[:attributes] }
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.user_topic_path(user_slug: object.user.slug, topic_slug: object.slug)
  end
end
