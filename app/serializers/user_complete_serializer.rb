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
             :articles_count

  has_one :tracker

  # has_many :activities, serializer: PublicActivitiesSerializer
  # has_many :articles, serializer: ArticleSampleSerializer
  # has_many :comments, serializer: CommentSerializer

  def created_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def last_sign_in_at
    I18n.l(object.last_sign_in_at, format: :custom).mb_chars.downcase.to_s if object.last_sign_in_at
  end

  def articles_count
    object.articles.size
  end
end
