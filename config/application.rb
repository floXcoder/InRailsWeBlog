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
  config = YAML.safe_load(File.read(File.expand_path('application.yml', __dir__)), aliases: true)
  config.merge!(config.fetch(Rails.env, {}))
  config.each do |key, value|
    ENV[key] = value.to_s unless value.is_a?(Hash)
  end
end

module InRailsWeBlog
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

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

    # Load files from lib directory
    config.enable_dependency_loading = true
    config.eager_load_paths << "#{config.root}/app/services"
    config.eager_load_paths << "#{config.root}/lib/inrailsweblog"
    config.eager_load_paths << "#{config.root}/spec/mailers/previews"

    # Database time zone
    config.time_zone                      = 'Paris'
    config.active_record.default_timezone = :local

    # Include the authenticity token in remote forms.
    config.action_view.embed_authenticity_token_in_remote_forms = true

    # Log levels :debug, :info, :warn, :error, :fatal and :unknown
    config.log_level = :info

    # I18n configuration
    config.i18n.default_locale = :en
    config.i18n.fallbacks      = [:en, :fr]

    # Enable per-form CSRF tokens. Previous versions had false.
    config.action_controller.per_form_csrf_tokens = false

    # Enable origin-checking CSRF mitigation. Previous versions had false.
    config.action_controller.forgery_protection_origin_check = true

    # Make Active Record use stable #cache_key alongside new #cache_version method.
    # This is needed for recyclable cache keys.
    config.active_record.cache_versioning = true

    # Require to deserialize paper trail versions
    config.active_record.use_yaml_unsafe_load = true

    # Use AES-256-GCM authenticated encryption for encrypted cookies.
    # Also, embed cookie expiry in signed or encrypted cookies for increased security.
    #
    # This option is not backwards compatible with earlier Rails versions.
    # It's best enabled when your entire app is migrated and stable on 5.2.
    #
    # Existing cookies will be converted on read then written with the new scheme.
    config.action_dispatch.use_authenticated_cookie_encryption = true

    # Use AES-256-GCM authenticated encryption as default cipher for encrypting messages
    # instead of AES-256-CBC, when use_authenticated_message_encryption is set to true.
    config.active_support.use_authenticated_message_encryption = true

    # Add default protection from forgery to ActionController::Base instead of in
    # ApplicationController.
    config.action_controller.default_protect_from_forgery = true

    # Use SHA-1 instead of MD5 to generate non-sensitive digests, such as the ETag header.
    config.active_support.key_generator_hash_digest_class = OpenSSL::Digest::SHA256
    config.active_support.hash_digest_class               = OpenSSL::Digest::SHA256

    # Use sidekiq for ActiveJob (not working with letter_opener)
    config.active_job.queue_adapter = :sidekiq

    # Errors handling
    # Errors are handled by ApplicationController
    # config.exceptions_app = self.routes

    # App-specific configuration
    config.settings = config_for(:settings)

    # Cache with Redis
    config.cache_store = :redis_cache_store, {
      url:             "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}",
      namespace:       "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache",
      db:              ENV['REDIS_DB'].to_i,
      expires_in:      config.settings.session_duration.to_i,
      connect_timeout: 30, # Defaults to 20 seconds
      read_timeout: 0.2, # Defaults to 1 second
      write_timeout: 0.2, # Defaults to 1 second
      reconnect_attempts: 1, # Defaults to 0
      # Compression is enabled by default with a 1kB threshold, so cached values larger than 1kB are automatically compressed.
      compress: true,
      compress_threshold: 1.kilobytes,
      # Increase the number of available connections you can enable connection pooling for multi-threaded server like Puma.
      pool_size: 5,
      pool_timeout: 5
    }
  end

  # Declare shortcut to access to settings
  def self.settings
    OpenStruct.new(Rails.configuration.settings)
  end
end
