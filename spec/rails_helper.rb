# frozen_string_literal: true

if ENV['COVERAGE']
  require 'simplecov'
end

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
# Prevent database truncation if the environment is production
abort('The Rails environment is running in production mode!') if Rails.env.production?
require 'rspec/rails'

# Add additional requires below this line. Rails is not loaded until this point!
require 'shoulda/matchers'
require 'shoulda-callback-matchers'
require 'faker'
require 'factory_bot_rails'
require 'database_cleaner'
require 'fuubar'
require 'awesome_print'
require 'webmock/rspec'

require 'spec_helper'

include Warden::Test::Helpers

# Setup warden in test mode
Warden.test_mode!

# Background jobs: By default, all jobs are executed immediately

# Authorize localhost requests, mock all other requests
WebMock.disable_net_connect!(allow_localhost: true)

# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
require 'support/database_cleaner'
require 'support/factory_girl'
require 'support/headers'
require 'support/i18n'

Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# Checks for pending migration and applies them before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_paths = [Rails.root.join('spec/fixtures')]

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!

  config.fuubar_progress_bar_options = { format: 'Progress: <%B> %p%% %a' }

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec

    with.library :active_record
    with.library :active_model
  end
end

# Define default URL for tests
Rails.application.routes.default_url_options[:host] = ENV['WEBSITE_HOST']
