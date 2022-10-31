# frozen_string_literal: true

Sidekiq.configure_server do |config|
  config.redis = { url:       "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }

  config.logger.level = Logger::INFO
end

Sidekiq.configure_client do |config|
  config.redis = { url:       "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }
end
