# frozen_string_literal: true

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Ensures that a master key has been made available in ENV["RAILS_MASTER_KEY"], config/master.key, or an environment
  # key such as config/credentials/production.key. This key is used to decrypt credentials (and other encrypted files).
  config.require_master_key = false

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  if ENV['RAILS_SERVE_STATIC_FILES'].present?
    config.public_file_server.headers = {
      'Access-Control-Allow-Origin'  => '*',
      'Access-Control-Allow-Methods' => 'GET',
      'X-Content-Type-Options'       => '"nosniff" always',
      'X-XSS-Protection'             => '"1; mode=block"',
      'Cache-Control'                => "public, immutable, max-age=#{1.day.to_i}"
    }
  end

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.action_controller.asset_host          = ENV['ASSETS_HOST']
  config.action_controller.default_url_options = { host: ENV['WEBSITE_HOST'] }

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Skip http-to-https redirect for the default health check endpoint.
  # config.ssl_options = { redirect: { exclude: ->(request) { request.path == "/up" } } }

  # Info include generic and useful information about system operation, but avoids logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII). If you
  # want to log everything, set the level to "debug".
  config.log_level = ENV.fetch('RAILS_LOG_LEVEL', 'info')

  # Prepend all log lines with the following tags.
  config.log_tags = [:host, :remote_ip, :uuid, lambda do |request|
    bot = CRAWLER_USER_AGENTS.find { |crawler_user_agent| request.user_agent&.downcase&.include?(crawler_user_agent.downcase) }
    bot.present? ? "bot:#{bot}" : nil
  end]

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  if ENV['RAILS_LOG_TO_STDOUT'].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  config.lograge.enabled        = true
  config.lograge.custom_options = lambda do |event|
    options           = event.payload.slice(:host, :subdomain, :request_id, :user_id, :admin_id, :referer)
    options[:params]  = event.payload[:params].except('controller', 'action') if event.payload[:params]
    options[:referer] = event.payload[:referer] if event.payload[:referer].present?
    options[:view]    = event.payload[:view_runtime] if event.payload[:view_runtime].to_f > 0
    options[:search]  = event.payload[:searchkick_runtime] if event.payload[:searchkick_runtime].to_f > 0
    options
  end

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = '/up'

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Replace the default in-process memory cache store with a durable alternative.
  # config.cache_store = :mem_cache_store

  # Replace the default in-process and non-durable queuing backend for Active Job.
  # config.active_job.queue_adapter = :resque
  config.active_job.logger = Logger.new(Rails.root.join('log/jobs.log'))

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Set host to be used by links generated in mailer templates.
  config.action_mailer.default_url_options   = { host: ENV['WEBSITE_HOST'] }
  config.action_mailer.delivery_method       = :smtp
  config.action_mailer.perform_deliveries    = true
  config.action_mailer.perform_caching       = false
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default charset: 'utf-8'
  config.action_mailer.smtp_settings = {
    ssl:                 true,
    address:             ENV['SMTP_HOST'],
    port:                ENV['SMTP_PORT'],
    domain:              ENV['WEBSITE_HOST'],
    authentication:      'login',
    user_name:           ENV['WEBSITE_EMAIL'],
    password:            ENV['WEBSITE_EMAIL_PASSWORD'],
    openssl_verify_mode: 'none',
    open_timeout:        3,
    read_timeout:        3
  }

  # Specify outgoing SMTP server. Remember to add smtp/* credentials via rails credentials:edit.
  # config.action_mailer.smtp_settings = {
  #   user_name: Rails.application.credentials.dig(:smtp, :user_name),
  #   password: Rails.application.credentials.dig(:smtp, :password),
  #   address: "smtp.example.com",
  #   port: 587,
  #   authentication: :plain
  # }

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  # config.i18n.fallbacks = [:en, :fr]

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use :id for inspections in production.
  config.active_record.attributes_for_inspect = [:id]

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  #
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end
