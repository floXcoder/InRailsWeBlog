# frozen_string_literal: true

# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://#{ENV['WEBSITE_ADDRESS']}"
SitemapGenerator::Interpreter.send :include, SitemapHelper

# Default changefreq: 'weekly'
# Default lastmod: Time.now
# Default priority: 0.5
SitemapGenerator::Sitemap.create do
  group(filename: :static_pages) do
    add root_path,
        changefreq: 'daily',
        priority:   1

    # add contact_path,
    #     changefreq: 'monthly',
    #     priority:   0.6
    # add support_path,
    #     changefreq: 'monthly',
    #     priority:   0.6
    # add about_us_path,
    #     changefreq: 'monthly',
    #     priority:   0.2
    # add terms_path,
    #     changefreq: 'monthly',
    #     priority:   0.2
    # add privacy_path,
    #     changefreq: 'monthly',
    #     priority:   0.2
  end

  group(filename: :articles) do
    Article.includes(:user, :pictures).everyone.find_in_batches(batch_size: 200) do |articles|
      articles.each do |article|
        add article.link_path,
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    article.updated_at,
            images:     [{
                           loc:     article.default_picture,
                           title:   article.title,
                           caption: article.summary
                         }]
      end
    end
  end

  group(filename: :topics) do
    Topic.everyone.find_in_batches(batch_size: 200) do |topics|
      topics.each do |topic|
        add topic.link_path(route_name: 'index'),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    topic.updated_at
      end

      topics.each do |topic|
        add topic.link_path(route_name: 'tags'),
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    topic.updated_at
      end
    end
  end

  group(filename: :tags) do
    Tag.everyone.find_in_batches(batch_size: 200) do |tags|
      tags.each do |tag|
        add tag.link_path,
            changefreq: 'weekly',
            priority:   0.7,
            lastmod:    tag.updated_at
      end

      tags.each do |tag|
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
        add user.link_path(route_name: 'index'),
            changefreq: 'weekly',
            priority:   0.5,
            lastmod:    user.updated_at
      end
    end
  end
end

# SitemapGenerator::Sitemap.ping_search_engines("https://#{ENV['WEBSITE_ADDRESS']}/sitemap.xml.gz")
