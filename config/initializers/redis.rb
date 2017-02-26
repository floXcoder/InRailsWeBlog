$redis = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT']), warnings: false)
