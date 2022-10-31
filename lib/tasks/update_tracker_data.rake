# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:update_tracker_data
  desc 'Update tracker data for all models'
  task :update_tracker_data, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    # Add a cron job to update database each InRailsWeBlog.settings.tracker_cron minutes
    # Automatically added to cron jobs when loading application

    return unless InRailsWeBlog.settings.cron_jobs_active

    [User, Tag, Topic, Article].each do |model|
      # Get current class name
      formatted_name = model.name.underscore

      UpdateTrackerWorker.new.perform(tracked_class: formatted_name)
    end
  end

end
