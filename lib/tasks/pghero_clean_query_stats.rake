# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:pghero_clean_query_stats
  desc 'pghero: Remove old stats'
  task :pghero_clean_query_stats, [] => :environment do |_task, _args|
    Rails.logger       = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    PgHero.clean_query_stats

    Rails.logger.warn("#{Time.now} : pghero: Remove old stats DONE")
  end
end
