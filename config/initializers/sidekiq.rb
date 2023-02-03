# frozen_string_literal: true

Sidekiq.configure_server do |config|
  config.redis = {
    url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
    db:  ENV['REDIS_DB'].to_i
  }

  config.logger.level = Logger::INFO
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
    db:  ENV['REDIS_DB'].to_i
  }
end
