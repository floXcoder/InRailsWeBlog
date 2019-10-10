# frozen_string_literal: true

class UserCompleteSerializer < ActiveModel::Serializer
  cache key: 'complete_user', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :city,
             :country,
             :additional_info,
             :locale,
             :created_at,
             :avatar_url,
             :slug,
             :sign_in_count,
             :last_sign_in_at,
             :articles_count,
             :link

  has_one :tracker

  def created_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def last_sign_in_at
    I18n.l(object.last_sign_in_at, format: :custom).mb_chars.downcase.to_s if object.last_sign_in_at
  end

  def articles_count
    object.articles.size
  end

  def link
    Rails.application.routes.url_helpers.show_user_path(user_slug: object.slug)
  end
end
