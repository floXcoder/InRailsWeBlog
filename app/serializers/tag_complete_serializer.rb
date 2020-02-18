# frozen_string_literal: true

class TagCompleteSerializer
  include FastJsonapi::ObjectSerializer

  set_type :tag

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :name,
             :description,
             :synonyms,
             :priority,
             :visibility,
             :tagged_articles_count,
             :slug,
             :parents

  belongs_to :user, serializer: UserSampleSerializer

  has_one :tracker

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :date do |object|
    I18n.l(object.created_at, format: :custom).sub(/^[0]+/, '')
  end

  attribute :parents do |object, params|
    object.parents_for_user(params[:current_user_id])
  end

  attribute :children do |object, params|
    object.children_for_user(params[:current_user_id])
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_tag_path(tag_slug: object.slug)
  end
end
