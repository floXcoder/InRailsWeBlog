# frozen_string_literal: true

class UserCompleteSerializer
  include FastJsonapi::ObjectSerializer

  set_type :user

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :pseudo,
             :email,
             :first_name,
             :last_name,
             :city,
             :country,
             :additional_info,
             :locale,
             :avatar_url,
             :slug,
             :sign_in_count

  has_one :tracker

  attribute :created_at do |object|
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  attribute :last_sign_in_at do |object|
    I18n.l(object.last_sign_in_at, format: :custom).mb_chars.downcase.to_s if object.last_sign_in_at
  end

  attribute :articles_count do |object|
    object.article_ids.size
  end

  attribute :link do |object|
    Rails.application.routes.url_helpers.show_user_path(user_slug: object.slug)
  end
end
