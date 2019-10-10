# frozen_string_literal: true

class UserStrictSerializer < ActiveModel::Serializer
  # cache key: 'user_strict', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :pseudo,
             :date,
             :avatar_url,
             :slug,
             :link

  def id
    object.id
  end

  def pseudo
    object.pseudo
  end

  def date
    object.created_at.to_i
  end

  def avatar_url
    object.avatar_url
  end

  def slug
    object.slug
  end

  def link
    Rails.application.routes.url_helpers.show_user_path(user_slug: object.slug) if instance_options[:with_link]
  end
end
