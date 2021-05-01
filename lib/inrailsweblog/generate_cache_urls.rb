# frozen_string_literal: true

class GenerateCacheUrls
  def all_urls
    I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        [
          url_statics(locale),
          url_tags(locale),
          url_topics(locale),
          url_articles(locale),
          url_users(locale)
        ].flatten.compact.uniq
      end
    end.flatten
  end

  def last_modified_urls(since = 24.hours)
    I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        [
          Rails.application.routes.url_helpers.send("home_#{locale}_path"),
          url_tags(locale, updated_at: since.ago..),
          url_topics(locale, updated_at: since.ago..),
          url_articles(locale, updated_at: since.ago..)
        ].flatten.compact.uniq
      end
    end.flatten
  end

  private

  def url_statics(locale)
    [
      Rails.application.routes.url_helpers.send("home_#{locale}_path"),

      Rails.application.routes.url_helpers.send("tags_#{locale}_path"),

      Rails.application.routes.url_helpers.send("search_#{locale}_path"),

      Rails.application.routes.url_helpers.send("about_#{locale}_path"),
      Rails.application.routes.url_helpers.send("terms_#{locale}_path"),
      Rails.application.routes.url_helpers.send("privacy_#{locale}_path")
    ]
  end

  def url_tags(locale, where_options = nil)
    Tag.everyone.where(where_options).map do |tag|
      [
        tag.link_path(locale: locale),
        tag.link_path(route_name: 'index', locale: locale)
      ]
    end
  end

  def url_topics(locale, where_options = nil)
    Topic.everyone.where(where_options).map do |topic|
      next unless topic.articles.everyone.count > 0

      [
        topic.link_path(locale: locale),
        topic.link_path(route_name: 'index', locale: locale),
        topic.link_path(route_name: 'tags', locale: locale),
        topic.link_path(route_name: 'articles', locale: locale)
      ]
    end
  end

  def url_articles(locale, where_options = nil)
    Article.everyone.where(where_options).map do |article|
      [
        article.link_path(locale: locale)
      ]
    end
  end

  def url_users(locale, where_options = nil)
    User.everyone.where(where_options).map do |user|
      next unless user.articles.everyone.count > 0

      [
        user.link_path(route_name: 'topics', locale: locale),
        user.link_path(route_name: 'index', locale: locale)
      ]
    end
  end
end
