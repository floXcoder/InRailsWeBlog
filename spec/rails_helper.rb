ENV['RAILS_ENV'] ||= 'test'

require 'simplecov'
require 'spec_helper'
require File.expand_path('../../config/environment', __FILE__)
abort('The Rails environment is running in production mode!') if Rails.env.production?
require 'rspec/rails'

# Add additional requires below this line. Rails is not loaded until this point!
require 'capybara/rails'
require 'capybara/email/rspec'
require 'shoulda/matchers'
require 'capybara-screenshot/rspec'
require 'factory_girl_rails'
require 'database_cleaner'
require 'fuubar'
require 'awesome_print'
require 'sidekiq/testing'
require 'html_validation'
include PageValidations

Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# Checks for pending migrations before tests are run.
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # Since we’re doing our own db cleaning with Database Cleaner, turned it off:
  config.use_transactional_fixtures = false

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  config.infer_spec_type_from_file_location!

  # Fuubar progression display
  config.fuubar_progress_bar_options = { format: 'Progress: <%B> %p%% %a' }
end

# Shoulda configuration
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec

    with.library :active_record
    with.library :active_model
  end
end
