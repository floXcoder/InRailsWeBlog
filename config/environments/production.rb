# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Ensures that a master key has been made available in ENV["RAILS_MASTER_KEY"], config/master.key, or an environment
  # key such as config/credentials/production.key. This key is used to decrypt credentials (and other encrypted files).
  config.require_master_key = false

  # Enable static file serving from the `/public` folder (turn off if using NGINX/Apache for it).
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.action_controller.asset_host          = ENV['WEBSITE_ASSET']
  config.action_controller.default_url_options = { host: ENV['WEBSITE_ADDRESS'] }

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for Apache
  # config.action_dispatch.x_sendfile_header = "X-Accel-Redirect" # for NGINX

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Can be used together with config.force_ssl for Strict-Transport-Security and secure cookies.
  # config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

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

  # Use default cache store in production (from application.rb).
  # config.cache_store = :redis_cache_store

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # config.active_job.queue_adapter     = :resque
  # config.active_job.queue_name_prefix = "MapPlanner_#{Rails.env}"
  config.active_job.logger = Logger.new(Rails.root.join('log/jobs.log'))

  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = [:en, :fr]

  # Don't log any deprecations.
  config.active_support.report_deprecations = :notify

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Mails
  config.action_mailer.default_url_options   = { host: ENV['WEBSITE_ADDRESS'] }
  config.action_mailer.delivery_method       = :smtp
  config.action_mailer.perform_deliveries    = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default charset: 'utf-8'
  config.action_mailer.smtp_settings = {
    ssl:                 true,
    address:             ENV['SMTP_HOST'],
    port:                ENV['SMTP_PORT'],
    domain:              ENV['WEBSITE_ADDRESS'],
    authentication:      'login',
    user_name:           ENV['WEBSITE_EMAIL'],
    password:            ENV['WEBSITE_EMAIL_PASSWORD'],
    openssl_verify_mode: 'none',
    open_timeout:        3,
    read_timeout:        3
  }
  # Direct
  # config.action_mailer.smtp_settings = {
  #   ssl:            true,
  #   address:        ENV['SMTP_HOST'],
  #   port:           ENV['SMTP_PORT'],
  #   domain:         ENV['WEBSITE_ADDRESS_EN'],
  #   authentication: 'login',
  #   user_name:      ENV['EMAIL_USER'],
  #   password:       ENV['EMAIL_PASSWORD'],
  #   open_timeout:   3,
  #   read_timeout:   3
  #   # openssl_verify_mode: 'none'
  # }

  # Inserts middleware to perform automatic connection switching.
  # The `database_selector` hash is used to pass options to the DatabaseSelector
  # middleware. The `delay` is used to determine how long to wait after a write
  # to send a subsequent read to the primary.
  #
  # The `database_resolver` class is used by the middleware to determine which
  # database is appropriate to use based on the time delay.
  #
  # The `database_resolver_context` class is used by the middleware to set
  # timestamps for the last write to the primary. The resolver uses the context
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end
