# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:flush_redis
  desc 'Flush all Redis keys related to the application (by default, only cache keys).'
  task :flush_redis, [:option] => :environment do |_task, args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.zone.now} : Flush redis task")

    # Keys to flush:
    # _InRailsWeBlog_#{Rails.env}:*

    # Keys used:
    # _InRailsWeBlog_#{Rails.env}:cache
    # _InRailsWeBlog_#{Rails.env}:session
    # _InRailsWeBlog_#{Rails.env}:geocoder
    # _InRailsWeBlog_#{Rails.env}:cron_job
    # _InRailsWeBlog_#{Rails.env}:(sidekiq)

    app = if args.option == 'all'
            Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}", redis: Redis.new)
          else
            Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new)
          end
    app.keys.each { |key| app.del(key) }
  end

end
