# frozen_string_literal: true

require_relative 'boot'

# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
# require 'action_cable/engine'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# Preload variables in application.yml to local ENV unless variables are already defined (by Gitlab runner for instance)
unless ENV['CI_SERVER']
  config = YAML.safe_load_file(File.expand_path('application.yml', __dir__), aliases: true)
  config.merge!(config.fetch(Rails.env, {}))
  config.each do |key, value|
    ENV[key] = value.to_s unless value.is_a?(Hash)
  end
end

module InRailsWeBlog
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[geocoding tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    config.eager_load_paths << "#{config.root}/app/services"
    config.eager_load_paths << "#{config.root}/lib/inrailsweblog"
    config.eager_load_paths << "#{config.root}/lib/populate"
    config.eager_load_paths << "#{config.root}/spec/mailers/previews"

    # Database time zone
    config.time_zone                      = 'Paris'
    config.active_record.default_timezone = :local

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    #
    config.generators do |generator|
      generator.test_framework :rspec,
                               fixtures:         true,
                               view_specs:       false,
                               helper_specs:     false,
                               routing_specs:    false,
                               controller_specs: true,
                               request_specs:    true
      generator.fixture_replacement :factory_bot, dir: 'spec/factories'
      generator.assets false
    end

    # Don't generate system test files.
    config.generators.system_tests = nil

    # Use sidekiq for ActiveJob (not working with letter_opener)
    config.active_job.queue_adapter = :sidekiq

    # I18n configuration
    config.i18n.default_locale = :en
    config.i18n.fallbacks      = [:en, :fr]

    # App-specific configuration
    config.settings = config_for(:settings)

    config.cache_store = :redis_cache_store, {
      url:             "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
      namespace:       "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache",
      db:              ENV['REDIS_DB'].to_i,
      expires_in:      config.settings.session_duration.to_i,
      connect_timeout: 30, # Defaults to 20 seconds
      read_timeout: 0.2, # Defaults to 1 second
      write_timeout: 0.2, # Defaults to 1 second
      reconnect_attempts: 3, # Defaults to 0
      # Compression is enabled by default with a 1kB threshold, so cached values larger than 1kB are automatically compressed.
      compress:           true,
      compress_threshold: 1.kilobytes,
      # Increase the number of available connections you can enable connection pooling for multi-threaded server like Puma.
      pool:      { size: 5, timeout: 5 }
    }

    Regexp.timeout = 5
  end

  # Declare shortcut to access to settings
  def self.settings
    OpenStruct.new(Rails.configuration.settings)
  end
end
