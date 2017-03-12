Sidekiq.configure_server do |config|
  config.redis = { url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }

  if Rails.configuration.x.cron_jobs_active
    schedule_file = 'config/sidekiq_schedule.yml'
    if File.exists?(schedule_file) && Sidekiq.server?
      Sidekiq::Cron::Job.load_from_hash! YAML.load_file(schedule_file)
    end
  else
    # Remove existing keys
    app = Redis::Namespace.new("_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cron_job", redis: Redis.new)
    app.keys.each { |key| app.del(key) }
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
                   namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}" }
end
