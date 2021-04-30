# frozen_string_literal: true

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:remove_unused_tags
  desc 'Remove tags with no associated articles'
  task :remove_unused_tags, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.zone.now} : Remove unused tags task")

    UnusedTagsWorker.new.perform
  end

end
