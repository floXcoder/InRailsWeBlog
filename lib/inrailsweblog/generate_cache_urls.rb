# frozen_string_literal: true

class GenerateCacheUrls
  def all_urls
    [
      url_statics,
      url_users,
      url_tags,
      url_topics,
      url_articles
    ].flatten.compact.uniq
  end

  private

  def url_statics
    [
      '/',
      '/tags'
    ]
  end

  def url_users
    User.select(:slug, :visibility).everyone.map do |user|
      "/users/#{user.slug}"
    end
  end

  def url_tags
    Tag.select(:slug, :visibility).everyone.map do |tag|
      [
        "/tags/#{tag.slug}",
        "/tagged/#{tag.slug}"
      ]
    end
  end

  def url_topics
    Topic.select(:slug, :visibility, :user_id).everyone.map do |topic|
      [
        "/users/#{topic.user.slug}/topics/#{topic.slug}",
        "/users/#{topic.user.slug}/topics/#{topic.slug}/tags"
      ]
    end
  end

  def url_articles
    Article.select(:slug, :visibility, :user_id).everyone.map do |article|
      "/users/#{article.user.slug}/articles/#{article.slug}"
    end
  end
end
