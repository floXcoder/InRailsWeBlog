source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby '2.4.1'

# Rails version
gem 'rails',                    '5.1.5'

# Use postgresql as the database for Active Record
gem 'pg',                       '0.21.0'

# HTTP Response
gem 'responders',               '2.4.0'
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '5.0.5'

# JSON
gem 'active_model_serializers', '0.10.7'
gem 'oj',                       '3.4.0'
gem 'oj_mimic_json',            '1.0.1'

# Use slim instead of erb
gem 'slim-rails',               '3.1.3'

# Internationalization
gem 'i18n-js',                  '3.0.4'
gem 'geocoder',                 '1.4.5'
gem 'maxminddb',                '0.1.15'

# Model versioning
gem 'paper_trail',              '8.1.2'

# Marked as deleted
gem 'paranoia',                 '2.4.0'

# User activities
gem 'public_activity',          '1.5.0'

# Format user input
gem 'auto_strip_attributes',    '2.3.0'
gem 'sanitize',                 '4.6.0'

# Run asynschronous process
gem 'sidekiq',                  '5.1.1'
gem 'sidekiq-statistic',        github: 'davydovanton/sidekiq-statistic'
gem 'sidekiq-cron',             '0.6.3'
gem 'whenever',                 '0.10.0', require: false

# Redis session store and cache
gem 'redis-namespace',          '1.6.0'
gem 'redis-session-store',      '0.9.2'
gem 'readthis',                 '2.2.0'
gem 'hiredis',                  '0.6.1'
gem 'redis-rack-cache',         '2.0.2'

# Database fields validator
gem 'date_validator',           '0.9.0'

# Global and model settings
gem 'simpleconfig',             '2.0.1'
gem 'rails-settings-cached',    '0.6.6'
gem 'storext',                  '2.2.2'

# Authentification
gem 'devise',                   '4.4.1'

# Authorization mechanism
gem 'pundit',                   '1.1.0'

# Upload pictures
gem 'carrierwave',              '1.2.2'
gem 'mini_magick',              '4.8.0'

# Search in database
gem 'searchkick',               '2.5.0'
gem 'typhoeus',                 '1.3.0'

# Votable models
gem 'thumbs_up',                '0.6.9'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Prevent DDOS attacks
gem 'rack-attack',              '5.0.1'

# Manage errors
gem 'browser',                  '2.5.2'

# SEO
gem 'friendly_id',              '5.2.3'
gem 'meta-tags',                '2.7.1'

# Dummy data
gem 'factory_bot_rails',        '4.8.2',   require: false
gem 'faker',                    '1.8.7',   require: false

# Deployment
gem 'capistrano',               '3.10.1'
gem 'capistrano-rails',         '1.3.1'
gem 'capistrano-rvm',           '0.1.2',   require: false
gem 'capistrano-bundler',       '1.3.0',   require: false
gem 'capistrano-rails-console', '2.2.1',   require: false
gem 'capistrano-db-tasks',      '0.6',     require: false
gem 'capistrano-sidekiq',       '1.0.0',   require: false
gem 'capistrano-passenger',     '0.2.0',   require: false

group :development do
  # server
  gem 'puma',                   '3.11.2'

  # Debugging tool
  gem 'pry-rails',              '0.3.6'
  gem 'awesome_print',          '1.8.0'

  # Improve errors
  gem 'better_errors',          '2.4.0'
  gem 'binding_of_caller',      '0.8.0'

  # N+1 database query
  gem 'bullet',                 '5.7.3'

  # Scss lint
  gem 'scss-lint',              '0.38.0', require: false

  # Guard and its minions
  gem 'guard',                  '2.14.2'
  gem 'guard-rails',            '0.8.1'
  gem 'guard-annotate',         '2.3'
  gem 'guard-bundler',          '2.1.0'
  gem 'guard-migrate',          '2.0.0'
  gem 'guard-rake',             '1.0.0'
  gem 'guard-rspec',            '4.7.3',  require: false
  gem 'guard-sidekiq',          '0.1.0'
  gem 'guard-process',          '1.2.1'

  # Find index to add
  gem 'lol_dba',                '2.1.4'
  gem 'unique_validation_inspector', '0.2.0'

  # Faster ruby code
  gem 'fasterer',               '0.4.0'
end

group :test do
  # Test tools
  gem 'rspec-rails',            '3.7.2'
  gem 'shoulda-matchers',       '3.1.2',    require: false
  gem 'shoulda-callback-matchers', '1.1.4', require: false
  gem 'simplecov',              '0.15.1',   require: false
  gem 'fuubar',                 '2.3.1'
  gem 'database_cleaner',       '1.6.2'
  gem 'spring-commands-rspec',  '1.0.4'
  gem 'db-query-matchers',      '0.9.0'

  # Browser tests
  gem 'capybara',               '2.18.0'
  gem 'capybara-email',         '2.5.0'
  gem 'capybara-screenshot',    '1.0.18'
  gem 'selenium-webdriver',     '3.9.0'
  gem 'chromedriver-helper',    '1.2.0'
  gem 'html_validation',        '1.1.5'
  gem 'launchy',                '2.4.3'

  # static analyzer
  gem 'rails_best_practices',   '1.19.0',   require: false
  gem 'brakeman',               '4.2.0',    require: false
  gem 'metric_fu',              '4.12.0',   require: false
  gem 'i18n-tasks',             '0.9.20',   require: false
end

group :development, :test do
  # Speed up server and tests
  gem 'spring',                 '2.0.2'
  gem 'spring-watcher-listen',  '2.0.1'

  # Check errors
  gem 'rubocop',                '0.52.1',  require: false
end

group :production do
  # server
  gem 'passenger',      '~> 5'

  # Improve log outputs
  gem 'lograge',        '0.9.0'

  # Website analysis
  gem 'newrelic_rpm',   '4.8.0.341'
end
