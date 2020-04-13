# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:clean_orphan_pictures
  desc 'Clean uploads without imageable and older than 1 day'
  task :clean_orphan_pictures, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.now} : Clean Orphan pictures task")

    UploadsWorker.perform
  end

end
