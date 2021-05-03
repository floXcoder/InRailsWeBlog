# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:clean_pghero_stats
  desc 'Clean PgHero stats'
  task :clean_pghero_stats, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.zone.now} : Clean PgHero stats task")

    PgHero.clean_query_stats
  end

end
