# frozen_string_literal: true

require "active_support/core_ext/integer/time"

# The test environment is used exclusively to run your application's
# test suite. You never need to work with it otherwise. Remember that
# your test database is "scratch space" for the test suite and is wiped
# and recreated between test runs. Don't rely on the data there!

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # While tests run files are not watched, reloading is not necessary.
  config.enable_reloading = false

  # Eager loading loads your entire application. When running a single test locally,
  # this is usually not necessary, and can slow down your test suite. However, it's
  # recommended that you enable it in continuous integration systems to ensure eager
  # loading is working properly before deploying your code.
  config.allow_concurrency = false
  config.eager_load        = false

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    'Access-Control-Allow-Origin' => '*',
    'Cache-Control'               => "public, max-age=#{1.hour.to_i}"
  }

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Use no cache store in test.
  config.cache_store = :null_store

  # Raise exceptions instead of rendering exception templates.
  config.action_dispatch.show_exceptions = :rescuable

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method       = :test
  host                                       = "localhost:#{ENV['TEST_PORT']}"
  config.action_mailer.default_url_options   = { host: host }
  config.action_mailer.preview_paths         << Rails.root.join('spec/mailers/previews')

  # Print deprecation notices to the stderr.
  config.active_support.deprecation = :stderr

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  config.action_view.annotate_rendered_view_with_filenames = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true

  config.action_controller.asset_host          = ENV['WEBSITE_ASSET']
  config.action_controller.default_url_options = {
    host: ENV['WEBSITE_ADDRESS'],
    port: ENV['WEBSITE_PORT']
  }

  # Logs
  #  config.log_level = :debug
  #  config.active_record.verbose_query_logs = true
  unless ENV['RAILS_ENABLE_TEST_LOG']
    config.logger    = Logger.new(nil)
    config.log_level = :error
  end

  # "Pretty" HTML format output
  Slim::Engine.set_options pretty: true
end
