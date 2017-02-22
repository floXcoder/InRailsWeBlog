# encoding: UTF-8
namespace :InRailsWeBlog do
  desc 'Flush all Redis keys related to InRailsWeBlog'
  task flush_redis: :environment do
    # Keys to flush:
    # _InRailsWeBlog_#{Rails.env}:*

    # Keys used:
    # _InRailsWeBlog_#{Rails.env}:cache
    # _InRailsWeBlog_#{Rails.env}:session
    # _InRailsWeBlog_#{Rails.env}:geocoder
    # _InRailsWeBlog_#{Rails.env}:(sidekiq)

    app = Redis::Namespace.new("_InRailsWeBlog_#{Rails.env}", redis: Redis.new)
    app.keys.each { |key| app.del(key) }
  end
end
