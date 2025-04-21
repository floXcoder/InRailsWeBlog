# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Example:
  # rails InRailsWeBlog:search_reindex
  desc 'Reindex all models for each locale'
  task :search_reindex, [:option] => :environment do |_task, args|
    Rails.logger       = ActiveRecord::Base.logger = Logger.new($stdout)
    Rails.logger.level = Logger::INFO

    reindex_options = {}
    if args.option == 'async'
      reindex_options[:mode] = :async
    end

    _user_visited_articles = Rails.cache.fetch('user_visited_articles', expires_in: 1.week) do
      User.select(:id).all.to_h do |user|
        [user.id, user.events.recent_articles(500).map { |e| e.properties['article_id'] }.tally]
      end
    end

    # Search index is by locale
    I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        Article.reindex(**reindex_options)
      end
    end

    # Search index is the same for all locales
    User.reindex(**reindex_options)
    Topic.reindex(**reindex_options)
    Tag.reindex(**reindex_options)

    Rails.logger.warn("#{Time.zone.now} : Reindex models with all locales task DONE")
  end
end
