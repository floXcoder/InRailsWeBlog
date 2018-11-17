# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Example:
  # rails InRailsWeBlog:regenerate_slugs
  desc 'Regenerate slugs for all models'
  task :regenerate_slugs, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.now} : Regenerate slugs task")

    ::Slug::regenerate
  end
end
