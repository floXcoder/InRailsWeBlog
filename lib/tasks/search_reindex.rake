# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Example:
  # rails InRailsWeBlog:search_reindex
  desc 'Reindex all models for each locale'
  task :search_reindex, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    # Search index is by locale
    I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        Article.reindex
      end
    end

    # Search index is the same for all locales
    User.reindex
    Topic.reindex
    Tag.reindex

    Rails.logger.warn("#{Time.zone.now} : Reindex models with all locales task DONE")
  end
end
