# frozen_string_literal: true

Sidekiq.configure_server do |config|
  config.redis = { url:       "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }

  config.server_middleware do |chain|
    chain.add AttentiveSidekiq::Middleware::Server::Attentionist
  end

  Sidekiq::Status.configure_server_middleware config, expiration: 60 * 60 * 24 * 30 # 30 days
  Sidekiq::Status.configure_client_middleware config, expiration: 60 * 60 * 24 * 30 # 30 days

  if InRailsWeBlog.config.cron_jobs_active
    schedule_file = 'config/sidekiq_schedule.yml'
    if File.exist?(schedule_file) && Sidekiq.server?
      Sidekiq::Cron::Job.load_from_hash! YAML.load_file(schedule_file)
    end
  else
    # Remove existing keys
    app = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cron_job", redis: Redis.new)
    app.keys.each { |key| app.del(key) }
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url:       "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }

  Sidekiq::Status.configure_client_middleware config, expiration: 60 * 60 * 24 * 30 # 30 days
end
