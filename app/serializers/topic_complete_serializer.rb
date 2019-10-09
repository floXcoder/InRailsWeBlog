# frozen_string_literal: true

class TopicCompleteSerializer < ActiveModel::Serializer
  cache key: 'topic_complete', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :visibility_translated,
             :settings,
             :slug,
             :articles_count,
             :created_at,
             :link

  belongs_to :user, if: -> { instance_options[:complete] }, serializer: UserSampleSerializer

  has_many :inventory_fields, serializer: Topic::InventoryFieldSerializer

  has_many :contributors, serializer: UserStrictSerializer

  has_one :tracker

  def visibility_translated
    object.visibility_to_tr
  end

  def created_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def link
    Rails.application.routes.url_helpers.show_topic_path(user_slug: object.user.slug, topic_slug: object.slug)
  end
end
