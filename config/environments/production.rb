# frozen_string_literal: true

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Ensures that a master key has been made available in either ENV["RAILS_MASTER_KEY"]
  # or in config/master.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  config.action_controller.default_url_options = { host: ENV['WEBSITE_ADDRESS'] }
  config.action_controller.asset_host          = ENV['WEBSITE_ASSET']

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Store uploaded files on the local file system (see config/storage.yml for options)
  # config.active_storage.service = :local

  # Mount Action Cable outside main process or domain
  # config.action_cable.mount_path = nil
  # config.action_cable.url = 'wss://example.com/cable'
  # config.action_cable.allowed_request_origins = [ 'http://example.com', /http:\/\/example.*/ ]

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :info

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment)
  # config.active_job.queue_adapter     = :resque
  # config.active_job.queue_name_prefix = "in_rails_we_blog_#{Rails.env}"
  config.active_job.logger = Logger.new(Rails.root.join('log/jobs.log'))

  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Prepend all log lines with the following tags.
  config.log_tags = [:host, :remote_ip, :uuid, lambda do |request|
    bot = CRAWLER_USER_AGENTS.find { |crawler_user_agent| request&.user_agent&.downcase&.include?(crawler_user_agent.downcase) }
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
end
