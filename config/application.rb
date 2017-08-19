require_relative 'boot'

# Pick the frameworks you want:
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_cable/engine'

# Require for performance test only
require 'rails/test_unit/railtie' if Rails.env.test?

Bundler.require(*Rails.groups)

# preload tokens in application.yml to local ENV
config = YAML.safe_load(File.read(File.expand_path('../application.yml', __FILE__)))
config.merge! config.fetch(Rails.env, {})
config.each do |key, value|
  ENV[key] = value.to_s unless value.is_a? Hash
end

module InRailsWeBlog
  class Application < Rails::Application
    config.generators do |generator|
      generator.test_framework :rspec,
                               fixtures: true,
                               view_specs: false,
                               helper_specs: false,
                               routing_specs: false,
                               controller_specs: true,
                               request_specs: true
      generator.fixture_replacement :factory_girl, dir: 'spec/factories'
      generator.assets false
    end

    # Load files from lib directory
    config.enable_dependency_loading = true
    config.autoload_paths += Dir["#{config.root}/lib/**/"]

    # Database time zone
    config.time_zone = 'Paris'
    config.active_record.default_timezone = :local

    # Include the authenticity token in remote forms.
    config.action_view.embed_authenticity_token_in_remote_forms = true

    # Log levels :debug, :info, :warn, :error, :fatal, et :unknown
    config.log_level = :warn if Rails.env.production?

    # Log file for development
    config.logger = ActiveSupport::TaggedLogging.new(Logger.new('log/development.log')) if Rails.env.development?

    # I18n configuration
    config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{ rb , yml }').to_s]
    config.i18n.default_locale = :fr
    config.i18n.fallbacks = true

    # Enable per-form CSRF tokens. Previous versions had false.
    config.action_controller.per_form_csrf_tokens = false

    # Enable origin-checking CSRF mitigation. Previous versions had false.
    config.action_controller.forgery_protection_origin_check = true

    # Json adapter for serializers
    ActiveModel::Serializer.config.adapter = :json

    # Cache with Redis
    config.cache_store = :readthis_store, {
      expires_in: 2.weeks.to_i,
      redis: { url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}", driver: :hiredis },
      namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache"
    }

    # Errors handling
    config.exceptions_app = self.routes

    # Custom configuration
    config.x.cron_jobs_active = true
  end
end
