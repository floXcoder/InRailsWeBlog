# frozen_string_literal: true

# == Schema Information
#
# Table name: topics
#
#  id                       :bigint           not null, primary key
#  user_id                  :bigint
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  color                    :string
#  priority                 :integer          default(0), not null
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  pictures_count           :integer          default(0)
#  articles_count           :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  settings                 :jsonb            not null
#  mode                     :integer          default("default"), not null
#

class TopicSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  extend SerializerHelper

  cache_options store: Rails.cache, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.config.cache_time

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
             :user_slug,
             :articles_count

  belongs_to :user, serializer: UserSerializer

  has_one :tracker, serializer: TrackerSerializer

  has_many :tags, serializer: TagSerializer do |object|
    Tag.includes(:parents, :children, :tagged_articles, :child_relationships).for_topic_id(object.id).order('tags.priority', 'tags.name')
  end

  has_many :contributors, record_type: :user, serializer: UserSerializer

  attribute :created_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :date_timestamp do |object|
    object.created_at.to_i
  end

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :inventory_fields do |object|
    Topic::InventoryFieldSerializer.new(object.inventory_fields).serializable_hash&.dig(:data)&.map { |d| d[:attributes] }
  end

  attribute :tag_ids do |object|
    object.tagged_articles.map(&:tag_id).uniq
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.user_topic_path(user_slug: object.respond_to?(:user_slug) ? object.user_slug : object.user.slug, topic_slug: object.slug)
  end

  attribute :settings do |object|
    UserSettingSerializer.new(object).serializable_hash[:data][:attributes].compact
  end
end
