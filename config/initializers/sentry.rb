# frozen_string_literal: true

if Rails.env.production? && ENV['SENTRY_RAILS_KEY']
  Raven.configure do |config|
    config.dsn = ENV['SENTRY_RAILS_KEY']

    config.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
  end
end
