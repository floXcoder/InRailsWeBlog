# frozen_string_literal: true

SitemapGenerator::Interpreter.send(:include, SitemapHelper)

# SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps'
SitemapGenerator::Sitemap.default_host = ENV['WEBSITE_FULL_ADDRESS']

# Default changefreq: 'weekly'
# Default lastmod: Time.now
# Default priority: 0.5
SitemapGenerator::Sitemap.create do
  group(filename: :static_pages) do
    add home_en_path,
        changefreq: 'daily',
        priority:   1

    # add about_en_path,
    #     changefreq: 'yearly'
    # add terms_en_path,
    #     changefreq: 'yearly'
    # add privacy_en_path,
    #     changefreq: 'yearly'
  end

  group(filename: :articles) do
    Article.includes(:user, :pictures).everyone.find_in_batches(batch_size: 200) do |articles|
      articles.each do |article|
        locale = article.languages.include?(I18n.locale.to_s) ? I18n.locale.to_s : article.languages.first

        add article.link_path(locale: locale),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    article.updated_at,
            images:     [{
                           loc:     article.default_picture[:jpg],
                           title:   article.title,
                           caption: article.summary
                         }]
      end
    end
  end

  group(filename: :topics) do
    Topic.everyone.find_in_batches(batch_size: 200) do |topics|
      topics.each do |topic|
        next unless topic.articles.everyone.count > 0

        locale = topic.languages.include?(I18n.locale.to_s) ? I18n.locale.to_s : topic.languages.first

        add topic.link_path(locale: locale),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    topic.updated_at

        add topic.link_path(route_name: 'tags', locale: locale),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    topic.updated_at

        add topic.link_path(route_name: 'articles', locale: locale),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    topic.updated_at
      end
    end
  end

  group(filename: :tags) do
    add tags_en_path,
        changefreq: 'daily'

    Tag.everyone.find_in_batches(batch_size: 200) do |tags|
      tags.each do |tag|
        add tag.link_path,
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    tag.updated_at

        add tag.link_path(route_name: 'index'),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    tag.updated_at
      end
    end
  end

  group(filename: :users) do
    User.everyone.find_in_batches(batch_size: 200) do |users|
      users.each do |user|
        next unless user.articles.everyone.count > 0

        add user.link_path(route_name: 'index'),
            changefreq: 'weekly',
            priority:   0.5,
            lastmod:    user.updated_at
      end
    end
  end
end

# SitemapGenerator::Sitemap.ping_search_engines("https://#{ENV['WEBSITE_ADDRESS']}/sitemap.xml.gz")
