# frozen_string_literal: true

Redis.exists_returns_integer = true

# Cache with Redis
Rails.application.config.cache_store = :redis_cache_store, {
  url:             "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
  expires_in:      InRailsWeBlog.settings.session_duration.to_i,
  namespace:       "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache",
  driver:          :hiredis,
  ssl_params:      { verify_mode: OpenSSL::SSL::VERIFY_NONE },
  connect_timeout: 30, # Defaults to 20 seconds
  read_timeout: 0.2, # Defaults to 1 second
  write_timeout: 0.2, # Defaults to 1 second
  reconnect_attempts: 1 # Defaults to 0
}

$redis = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache", redis: Redis.new(host: ENV['REDIS_HOST'], port: ENV['REDIS_PORT'], connect_timeout: 1, timeout: 1), warnings: false)

# To display cache hit or miss
# if Rails.en.production?
#   Rails.cache.logger = Logger.new('log/cache.log')
# end
