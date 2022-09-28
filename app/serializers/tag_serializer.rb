# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id                       :bigint           not null, primary key
#  user_id                  :bigint
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  synonyms                 :string           default([]), is an Array
#  color                    :string
#  notation                 :integer          default(0)
#  priority                 :integer          default(0)
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  allow_comment            :boolean          default(TRUE), not null
#  pictures_count           :integer          default(0)
#  tagged_articles_count    :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  comments_count           :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class TagSerializer
  include FastJsonapi::ObjectSerializer
  include NullAttributesRemover

  extend SerializerHelper

  cache_options store: SerializerHelper::CacheSerializer, namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", expires_in: InRailsWeBlog.settings.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :name,
             :description,
             :description_translations,
             :synonyms,
             :priority,
             :visibility,
             :tagged_articles_count,
             :slug

  belongs_to :user, serializer: UserSerializer

  has_one :tracker, serializer: TrackerSerializer

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :date do |object|
    I18n.l(object.created_at, format: :custom).sub(/^[0]+/, '')
  end

  attribute :date_timestamp do |object|
    object.created_at.to_i
  end

  attribute :parents do |object, params|
    object.parents_for_user(params[:current_user_id])
  end

  attribute :parent_ids do |object, params|
    if params[:current_topic_id]
      object.child_relationships.select { |relation| relation.topic_id == params[:current_topic_id] }.map(&:parent_id).uniq
    else
      []
    end
  end

  attribute :children do |object, params|
    object.children_for_user(params[:current_user_id])
  end

  attribute :child_ids do |object, params|
    if params[:current_topic_id]
      object.parent_relationships.select { |relation| relation.topic_id == params[:current_topic_id] }.map(&:child_id).uniq
    else
      []
    end
  end

  attribute :child_only do |object, params|
    object.child_only_for_topic(params[:current_topic_id])
  end

  attribute :topic_ids do |object|
    object.tagged_articles&.map(&:topic_id)&.uniq || object.topic_ids
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_tag_path(tag_slug: object.slug)
  end
end
