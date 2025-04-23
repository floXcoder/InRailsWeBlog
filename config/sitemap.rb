# frozen_string_literal: true

# SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps'
SitemapGenerator::Sitemap.default_host = ENV['WEBSITE_URL']

# SitemapGenerator::Interpreter.send(:include, SitemapHelper)

# Default changefreq: 'weekly'
# Default lastmod: Time.now
# Default priority: 0.5
I18n.available_locales.map do |locale|
  I18n.with_locale(locale) do
    SitemapGenerator::Sitemap.sitemaps_path = "sitemaps/#{locale}"

    SitemapGenerator::Sitemap.create do
      group(filename: :static_pages) do
        add send("home_#{locale}_path"),
            changefreq: 'daily',
            priority:   1

        # add send("about_#{locale}_path"),
        #     changefreq: 'yearly'
        # add send("terms_#{locale}_path"),
        #     changefreq: 'yearly'
        # add send("privacy_#{locale}_path"),
        #     changefreq: 'yearly'
      end

      group(filename: :articles) do
        Article.includes(:user, :pictures).everyone.with_locale(locale).find_in_batches(batch_size: 200) do |articles|
          articles.each do |article|
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
            next unless topic.articles.everyone.with_locale(locale).count > 0

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

        # Tagged topics
        Topic.everyone.each do |tagged_topic|
          tagged_topic.tags.each do |tag|
            next unless Article.where(topic_id: tagged_topic.id).joins(:tags).where(tags: { id: tag.id }).everyone.with_locale(locale).exists?

            add tagged_topic.link_path(route_name: 'tagged_topic', locale: locale, tag_slug: tag.slug),
                changefreq: 'weekly',
                priority:   0.7,
                lastmod:    tagged_topic.updated_at
          end
        end
      end

      group(filename: :tags) do
        add send("tags_#{locale}_path"),
            changefreq: 'daily'

        Tag.everyone.find_in_batches(batch_size: 200) do |tags|
          tags.each do |tag|
            next unless tag.articles.everyone.with_locale(locale).exists?

            add tag.link_path(locale: locale),
                changefreq: 'weekly',
                priority:   0.7,
                lastmod:    tag.updated_at

            add tag.link_path(route_name: 'index', locale: locale),
                changefreq: 'weekly',
                priority:   0.7,
                lastmod:    tag.updated_at
          end
        end
      end

      group(filename: :users) do
        User.everyone.find_in_batches(batch_size: 200) do |users|
          users.each do |user|
            next unless user.articles.everyone.with_locale(locale).count > 0

            add user.link_path(route_name: 'index', locale: locale),
                changefreq: 'weekly',
                priority:   0.5,
                lastmod:    user.updated_at
          end
        end
      end
    end
  end
end

# SitemapGenerator::Sitemap.ping_search_engines("https://#{ENV['WEBSITE_HOST']}/sitemap.xml.gz")
