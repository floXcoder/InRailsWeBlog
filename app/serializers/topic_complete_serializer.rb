# frozen_string_literal: true

class TopicCompleteSerializer
  include FastJsonapi::ObjectSerializer

  set_type :topic

  cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :settings,
             :slug,
             :articles_count

  belongs_to :user, if: Proc.new { |_record, params| params[:complete] }, serializer: UserSampleSerializer

  has_many :inventory_fields, serializer: Topic::InventoryFieldSerializer

  has_many :contributors, record_type: :user, serializer: UserStrictSerializer

  has_one :tracker

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :created_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_topic_path(user_slug: object.user.slug, topic_slug: object.slug)
  end
end
