source 'https://rubygems.org'

# Specify exact Ruby version (mandatory)
ruby '2.3.1'

# Rails version
gem 'rails',                    '4.2.6'

# Use postgresql as the database for Active Record
gem 'pg',                       '0.18.4'

# Dump database
gem 'yaml_db',                  git: 'https://github.com/yamldb/yaml_db.git'

# HTTP Response
gem 'responders',               '2.2.0'
gem 'http_accept_language',     '2.0.5'
gem 'secure_headers',           '3.4.0'

# JSON
gem 'active_model_serializers', '0.10.0'
gem 'oj',                       '2.17.1'
gem 'oj_mimic_json',            '1.0.1'

# Use slim instead of erb
gem 'slim-rails',               '3.1.0'

# Internationalization
gem 'i18n-js',                  '3.0.0.rc13'
gem 'geocoder',                 '1.3.7'
gem 'maxminddb',                '0.1.11'

# Model versioning
gem 'paper_trail',              '5.2.0'

# Marked as deleted
gem 'paranoia',                 '2.1.5'

# User activities
gem 'public_activity',          git: 'https://github.com/chaps-io/public_activity.git'

# Format user input
gem 'auto_strip_attributes',    '2.0.6'
gem 'sanitize',                 '4.1.0'

# Run asynschronous process
gem 'sidekiq',                  '4.1.4'
gem 'sidekiq-statistic',        '1.2.0'
gem 'sidekiq-cron',             '0.4.2'
gem 'sinatra',                  '1.4.7',     require: false
gem 'whenever',                 '0.9.7',     require: false

# Redis session store and cache
gem 'redis-namespace',          '1.5.2'
gem 'redis-session-store',      '0.9.1'
gem 'readthis',                 '1.5.0'
gem 'hiredis',                  '0.6.1'
gem 'redis-rack-cache',         '1.2.4'

# Database fields validator
gem 'date_validator',           '0.9.0'

# Global variables
gem 'simpleconfig',             '2.0.1'

# Authentification
gem 'devise',                   '4.2.0'

# Authorization mechanism
gem 'pundit',                   '1.1.0'

# Human-friendly URLs
gem 'friendly_id',              '5.1.0'

# Forms
gem 'simple_form',              '3.2.1'
gem 'country_select',           '2.5.2'

# Upload pictures
gem 'carrierwave',              '0.11.2'
gem 'carrierwave_backgrounder', '0.4.2'
gem 'mini_magick',              '4.5.1'

# Search in database
gem 'searchkick',               '1.3.1'

# Votable models
gem 'thumbs_up',                '0.6.9'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Errors management
gem 'rails_exception_handler',  git: 'https://github.com/Sharagoz/rails_exception_handler.git'

# Prevent DDOS attacks
gem 'rack-attack',              '4.4.1'

# Deployment
gem 'capistrano',               '3.5.0'
gem 'capistrano-rails',         '1.1.7'
gem 'capistrano-rvm',           '0.1.2',   require: false
gem 'capistrano-bundler',       '1.1.4',   require: false
gem 'capistrano-rails-console', '1.0.2',   require: false
gem 'capistrano-db-tasks',      '0.4',     require: false
gem 'capistrano-sidekiq',       '0.5.4',   require: false

# Website analysis
gem 'newrelic_rpm',             '3.16.0.318'

group :development do
  # server
  gem 'thin',                   '1.7.0'

  # Debugging tool
  gem 'pry-rails',              '0.3.4'
  gem 'awesome_print',          '1.7.0'

  # Improve errors
  gem 'better_errors',          '2.1.1'
  gem 'binding_of_caller',      '0.7.2'

  # Turn off unnecessary log output
  gem 'quiet_assets',           '1.1.0'

  # Scss lint
  gem 'scss-lint',              '0.38.0', require: false

  # Guard and its minions
  gem 'guard',                  '2.14.0'
  gem 'guard-rails',            '0.7.2'
  gem 'guard-annotate',         '2.3'
  gem 'guard-bundler',          '2.1.0'
  gem 'guard-migrate',          '1.2.1'
  gem 'guard-rake',             '1.0.0'
  gem 'guard-rspec',            '4.7.2',  require: false
  gem 'guard-sidekiq',          '0.1.0'
  gem 'guard-process',          '1.2.1'
  gem 'libnotify',              '0.9.1'

  # N+1 database query
  gem 'bullet',                 '5.1.1'

  # Find index to add
  gem 'lol_dba',                '2.0.3'

  # Faster ruby code
  gem 'fasterer',               '0.3.2'
end

group :test do
  # Test tools
  gem 'rspec-rails',            '3.5.1'
  gem 'capybara',               '2.7.1'
  gem 'capybara-email',         '2.5.0'
  gem 'capybara-screenshot',    '1.0.13'
  gem 'capybara-webkit',        '1.11.1'
  gem 'launchy',                '2.4.3'
  gem 'shoulda-matchers',       '3.1.1',    require: false
  gem 'shoulda-callback-matchers', '1.1.4', require: false
  gem 'html_validation',        '1.1.3'
  gem 'spork',                  '0.9.2'
  gem 'simplecov',              '0.12.0',   require: false
  gem 'fuubar',                 '2.1.1'
  gem 'database_cleaner',       '1.5.3'
  gem 'spring-commands-rspec',  '1.0.4'

  # static analyzer
  gem 'rails_best_practices',   '1.17.0',   require: false
  gem 'brakeman',               '3.3.2',    require: false
  gem 'metric_fu',              '4.12.0',   require: false
  gem 'i18n-tasks',             '0.9.5',    require: false
  gem 'deadweight',             '0.2.2',    require: false

  # Security
  gem 'dawnscanner',            '1.6.2',    require: false
end

group :development, :test do
  # Speed up server and tests
  gem 'spring',                 '1.7.2'

  # Check errors
  gem 'rubocop',                '0.41.2',  require: false

  # Dummy data
  gem 'factory_girl_rails',       '4.7.0'
  gem 'faker',                    '1.6.5'
end

group :production do
  # server
  gem 'passenger',      '~> 5'

  # Improve log outputs
  gem 'lograge',        '0.4.1'
end
