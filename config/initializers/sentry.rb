# frozen_string_literal: true

if Rails.env.production? && ENV['SENTRY_RAILS_KEY']
  Sentry.init do |config|
    config.dsn = ENV['SENTRY_RAILS_KEY']
    config.breadcrumbs_logger = [:active_support_logger, :http_logger]

    config.logger       = Logger.new(Rails.root.join('log/sentry.log'))
    config.logger.level = Logger::WARN

    # Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    config.traces_sample_rate = 1.0
  end
end
