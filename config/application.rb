require File.expand_path('../boot', __FILE__)

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# preload tokens in application.yml to local ENV
config = YAML.load(File.read(File.expand_path('../application.yml', __FILE__)))
config.merge! config.fetch(Rails.env, {})
config.each do |key, value|
  ENV[key] = value.to_s unless value.is_a? Hash
end

module InRailsWeBlog
  class Application < Rails::Application
    config.generators do |g|
      g.test_framework :rspec,
                       fixtures: true,
                       view_specs: false,
                       helper_specs: false,
                       routing_specs: false,
                       controller_specs: true,
                       request_specs: true
      g.fixture_replacement :factory_girl, dir: 'spec/factories'
      g.assets false
    end

    # Load files from lib directory
    config.autoload_paths += Dir["#{config.root}/lib/**/"]

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    # Include the authenticity token in remote forms.
    config.action_view.embed_authenticity_token_in_remote_forms = true

    # Debug mode disables concatenation and preprocessing of assets.
    config.assets.debug = false

    # Log levels :debug, :info, :warn, :error, :fatal, et :unknown
    config.log_level = :warn if Rails.env.production?

    # Log file for development
    config.logger = ActiveSupport::TaggedLogging.new(Logger.new('log/development.log')) if Rails.env.development?

    # "pretty" HTML format output
    Slim::Engine.set_options pretty: true
  end
end
