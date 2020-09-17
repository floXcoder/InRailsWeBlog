# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:flush_redis
  desc 'Flush all Redis keys related to the application (by default, only cache keys).'
  task :flush_redis, [:option] => :environment do |_task, args|
    Rails.logger       = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.zone.now} : Flush redis task")

    # Keys to flush:
    # _InRailsWeBlog_#{Rails.env}:*

    # Keys used:
    # _InRailsWeBlog_#{Rails.env}:cache
    # _InRailsWeBlog_#{Rails.env}:serializer
    # _InRailsWeBlog_#{Rails.env}:session
    # _InRailsWeBlog_#{Rails.env}:geocoder
    # _InRailsWeBlog_#{Rails.env}:cron_job
    # _InRailsWeBlog_#{Rails.env}:(sidekiq)

    if args.option == 'all'
      app = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}", redis: Redis.new)
      app.keys.each { |key| app.del(key) }
    else
      app_cache = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new)
      app_cache.keys.each { |key| app_cache.del(key) }

      app_serializer = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:serializer", redis: Redis.new)
      app_serializer.keys.each { |key| app_serializer.del(key) }
    end

  end

end
