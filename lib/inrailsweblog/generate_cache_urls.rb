# frozen_string_literal: true

class GenerateCacheUrls
  def all_urls
    I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        [
          url_statics(locale),
          url_users(locale),
          url_tags(locale),
          url_topics(locale),
          url_articles(locale)
        ].flatten.compact.uniq
      end
    end.flatten
  end

  private

  def url_statics(locale)
    [
      '/',
      '/tags'
    ]
  end

  def url_users(locale)
    User.everyone.map do |user|
      user.link_path(index: true)
    end
  end

  def url_tags(locale)
    Tag.everyone.map do |tag|
      [
        tag.link_path,
        tag.link_path(index: true)
      ]
    end
  end

  def url_topics(locale)
    Topic.everyone.map do |topic|
      [
        topic.link_path(index: true),
        topic.link_path(tags: true)
      ]
    end
  end

  def url_articles(locale)
    Article.everyone.map do |article|
      article.link_path
    end
  end
end
