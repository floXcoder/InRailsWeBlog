$redis = Redis::Namespace.new("_InRailsWeBlog_#{Rails.env}:cache", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT']), warnings: false)
