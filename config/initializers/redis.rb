$redis = Redis::Namespace.new("_InRailsWeBlog_#{Rails.env}:cache", redis: Redis.new)
