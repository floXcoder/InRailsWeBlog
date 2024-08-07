# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:reset_trackers
  desc 'Reset all tracking data'
  task :reset_trackers, [] => :environment do |_task, _args|
    Rails.logger       = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    Tracker.all.each do |tracker|
      tracker.views_count    = 0
      tracker.queries_count  = 0
      tracker.searches_count = 0
      tracker.clicks_count   = 0
      tracker.visits_count   = 0

      tracker.popularity = tracker.rank

      tracker.save
    end

    Rails.logger.warn("#{Time.zone.now} : Reset all tracking data DONE")
  end

end
