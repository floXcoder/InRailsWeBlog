# frozen_string_literal: true

if Rails.env.production? && ENV['SENTRY_RAILS_KEY']
  Sentry.init do |config|
    config.dsn = ENV['SENTRY_RAILS_KEY']

    config.breadcrumbs_logger = [:redis_logger, :http_logger, :active_support_logger] # :sentry_logger => generate error ("\xFF" from ASCII-8BIT to UTF-8)

    config.logger       = Logger.new(Rails.root.join('log/sentry.log'))
    config.logger.level = Logger::WARN

    config.enabled_patches << :faraday

    # Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    config.traces_sample_rate = 0.1

    # Disable Vernier for now: too many bugs with Jobs execution
    # config.profiles_sample_rate = 0.1
    # config.profiler_class = Sentry::Vernier::Profiler
  end
end
