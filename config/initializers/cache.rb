# frozen_string_literal: true

$redis = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], connect_timeout: 1, timeout: 1), warnings: false)

# To display cache hit or miss
# if Rails.en.production?
#   Rails.cache.logger = Logger.new('log/cache.log')
# end
