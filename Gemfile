source 'https://rubygems.org'

# Specify exact Ruby version (mandatory)
ruby '2.3.3'

# Rails version
gem 'rails',                    '5.0.2'

# Use postgresql as the database for Active Record
gem 'pg',                       '0.20.0'

# HTTP Response
gem 'responders',               '2.3.0'
gem 'http_accept_language',     '2.1.0'
gem 'secure_headers',           '3.6.2'

# JSON
gem 'active_model_serializers', '0.10.5'
gem 'oj',                       '2.18.5'
gem 'oj_mimic_json',            '1.0.1'

# Use slim instead of erb
gem 'slim-rails',               '3.1.2'

# Internationalization
gem 'i18n-js',                  '3.0.0.rc16'
gem 'geocoder',                 '1.4.3'
gem 'maxminddb',                '0.1.12'

# Convert JSON values in database (settings, ...)
gem 'storext',                  '2.2.2'

# Model versioning
gem 'paper_trail',              '6.0.2'

# Marked as deleted
gem 'paranoia',                 '2.2.1'

# User activities
gem 'public_activity',          '1.5.0'

# Format user input
gem 'auto_strip_attributes',    '2.1.0'
gem 'sanitize',                 '4.4.0'

# Run asynschronous process
gem 'sidekiq',                  '4.2.10'
gem 'sidekiq-statistic',        '1.2.0'
gem 'sidekiq-cron',             '0.4.5'
gem 'whenever',                 '0.9.7',     require: false

# Redis session store and cache
gem 'redis-namespace',          '1.5.3'
gem 'redis-session-store',      '0.9.1'
gem 'readthis',                 '2.0.2'
gem 'hiredis',                  '0.6.1'
gem 'redis-rack-cache',         '2.0.1'

# Database fields validator
gem 'date_validator',           '0.9.0'

# Global variables
gem 'simpleconfig',             '2.0.1'

# Authentification
gem 'devise',                   '4.2.1'

# Authorization mechanism
gem 'pundit',                   '1.1.0'

# Forms
gem 'simple_form',              '3.4.0'
gem 'country_select',           '3.0.0'

# Upload pictures
gem 'carrierwave',              '0.11.2'
gem 'carrierwave_backgrounder', '0.4.2'
gem 'mini_magick',              '4.7.0'

# Search in database
gem 'searchkick',               '2.2.0'

# Votable models
gem 'thumbs_up',                '0.6.9'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Prevent DDOS attacks
gem 'rack-attack',              '5.0.1'

# SEO
gem 'friendly_id',              '5.2.0'
gem 'meta-tags',                '2.4.0'

# Deployment
gem 'capistrano',               '3.8.0'
gem 'capistrano-rails',         '1.2.3'
gem 'capistrano-rvm',           '0.1.2',   require: false
gem 'capistrano-bundler',       '1.2.0',   require: false
gem 'capistrano-rails-console', '2.2.0',   require: false
gem 'capistrano-db-tasks',      '0.6',     require: false
gem 'capistrano-sidekiq',       '0.10.0',  require: false

group :development do
  # server
  gem 'puma',                   '3.8.2'

  # Debugging tool
  gem 'pry-rails',              '0.3.6'
  gem 'awesome_print',          '1.7.0'

  # Improve errors
  gem 'better_errors',          '2.1.1'
  gem 'binding_of_caller',      '0.7.2'

  # Scss lint
  gem 'scss-lint',              '0.38.0', require: false

  # Guard and its minions
  gem 'guard',                  '2.14.1'
  gem 'guard-rails',            '0.8.0'
  gem 'guard-annotate',         '2.3'
  gem 'guard-bundler',          '2.1.0'
  gem 'guard-migrate',          '2.0.0'
  gem 'guard-rake',             '1.0.0'
  gem 'guard-rspec',            '4.7.3',  require: false
  gem 'guard-sidekiq',          '0.1.0'
  gem 'guard-process',          '1.2.1'
  # gem 'libnotify',              '0.9.1'

  # N+1 database query
  gem 'bullet',                 '5.5.1'

  # Find index to add
  gem 'lol_dba',                '2.1.1'

  # Faster ruby code
  gem 'fasterer',               '0.3.2'
end

group :test do
  # Test tools
  gem 'rspec-rails',            '3.5.2'
  gem 'capybara',               '2.13.0'
  gem 'capybara-email',         '2.5.0'
  gem 'capybara-screenshot',    '1.0.14'
  gem 'shoulda-matchers',       '3.1.1',    require: false
  gem 'shoulda-callback-matchers', '1.1.4', require: false
  gem 'html_validation',        '1.1.3'
  gem 'simplecov',              '0.14.1',   require: false
  gem 'fuubar',                 '2.2.0'
  gem 'database_cleaner',       '1.5.3'
  gem 'spring-commands-rspec',  '1.0.4'

  # static analyzer
  gem 'rails_best_practices',   '1.18.0',   require: false
  gem 'brakeman',               '3.6.1',    require: false
  gem 'metric_fu',              '4.12.0',   require: false
  gem 'i18n-tasks',             '0.9.13',   require: false

  # Security
  gem 'dawnscanner',            '1.6.7',    require: false
end

group :development, :test do
  # Speed up server and tests
  gem 'spring',                 '2.0.1'

  # Check errors
  gem 'rubocop',                '0.48.0',  require: false

  # Dummy data
  gem 'factory_girl_rails',     '4.8.0'
  gem 'faker',                  '1.7.3'
end

group :production do
  # server
  gem 'passenger',      '~> 5'

  # Improve log outputs
  gem 'lograge',        '0.4.1'

  # Website analysis
  gem 'newrelic_rpm',             '4.0.0.332'
end
