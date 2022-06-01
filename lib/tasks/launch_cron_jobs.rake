# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Example:
  # rails InRailsWeBlog:launch_cron_jobs
  desc 'Launch all cron jobs'
  task :launch_cron_jobs, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    User.tracker_cron_job
    Tag.tracker_cron_job
    Topic.tracker_cron_job
    Article.tracker_cron_job

    Rails.logger.warn("#{Time.zone.now} : Launch cron jobs task DONE")
  end
end
