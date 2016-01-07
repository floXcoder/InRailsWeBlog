# encoding: UTF-8
namespace :InRailsWeBlog do

  desc 'Flush all Redis keys related to InRailsWeBlog'
  task flush_redis: :environment do

    # Keys to flush:
    # _InRailsWeBlog_cache:*
    # _InRailsWeBlog_session:*
    # cron_job:_InRailsWeBlog_job:*

    session = Redis::Namespace.new('_InRailsWeBlog_session', redis: Redis.new)
    session.keys.each { |key| session.del(key) }

    cache = Redis::Namespace.new('_InRailsWeBlog_cache', redis: Redis.new)
    cache.keys.each { |key| cache.del(key) }

    jobs = Redis::Namespace.new('cron_job:_InRailsWeBlog_job', redis: Redis.new)
    jobs.keys.each { |key| jobs.del(key) }
  end
end
