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
      user.link_path(index: true)
    end
  end

  def url_tags
    Tag.select(:slug, :visibility).everyone.map do |tag|
      [
        tag.link_path,
        tag.link_path(index: true)
      ]
    end
  end

  def url_topics
    Topic.select(:slug, :visibility, :user_id).everyone.map do |topic|
      [
        topic.link_path(index: true),
        topic.link_path(tags: true)
      ]
    end
  end

  def url_articles
    Article.select(:slug, :visibility, :user_id).everyone.map do |article|
      article.link_path
    end
  end
end
