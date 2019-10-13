# frozen_string_literal: true

class TagCompleteSerializer < ActiveModel::Serializer
  cache key: 'tag_complete', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :name,
             :description,
             :synonyms,
             :priority,
             :visibility,
             :visibility_translated,
             :tagged_articles_count,
             :date,
             :slug,
             :parents,
             :children,
             :link

  belongs_to :user, serializer: UserSampleSerializer

  has_one :tracker

  def visibility_translated
    object.visibility_to_tr
  end

  def date
    I18n.l(object.created_at, format: :custom).sub(/^[0]+/, '')
  end

  def parents
    object.parents_for_user(instance_options[:current_user_id])
  end

  def children
    object.children_for_user(instance_options[:current_user_id])
  end

  def link
    Rails.application.routes.url_helpers.show_tag_path(tag_slug: object.slug)
  end
end
