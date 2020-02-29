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

  private

  def url_statics(locale)
    [
      Rails.application.routes.url_helpers.send("home_#{locale}_path"),

      Rails.application.routes.url_helpers.send("tags_#{locale}_path"),

      Rails.application.routes.url_helpers.send("search_#{locale}_path"),

      Rails.application.routes.url_helpers.send("about_#{locale}_path"),
      Rails.application.routes.url_helpers.send("terms_#{locale}_path"),
      Rails.application.routes.url_helpers.send("policy_#{locale}_path")
    ]
  end

  def url_tags(locale)
    Tag.everyone.map do |tag|
      [
        tag.link_path(locale: locale),
        tag.link_path(route_name: 'index', locale: locale)
      ]
    end
  end

  def url_topics(locale)
    Topic.everyone.map do |topic|
      [
        topic.link_path(locale: locale),
        topic.link_path(route_name: 'index', locale: locale),
        topic.link_path(route_name: 'tags', locale: locale),
        topic.link_path(route_name: 'articles', locale: locale)
      ]
    end
  end

  def url_articles(locale)
    Article.everyone.map do |article|
      [
        article.link_path(locale: locale)
      ]
    end
  end

  def url_users(locale)
    User.everyone.map do |user|
      [
        # user.link_path(route_name: 'topics', locale: locale)
        # user.link_path(route_name: 'index', locale: locale)
      ]
    end
  end
end
