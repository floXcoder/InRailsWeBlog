# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:pghero_capture_stats
  desc 'pghero: capture stats'
  task :pghero_capture_stats, [] => :environment do |_task, _args|
    Rails.logger       = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    PgHero.capture_query_stats(verbose: true)
    PgHero.capture_space_stats(verbose: true)

    Rails.logger.warn("#{Time.now} : pghero: Capture stats DONE")
  end
end
