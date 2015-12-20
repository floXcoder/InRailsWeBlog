source 'https://rubygems.org'

# Specify exact Ruby version (mandatory)
ruby '2.2.3'

# Rails version
gem 'rails',                    '4.2.5'

# Use postgresql as the database for Active Record
gem 'pg',                       '~> 0.18.4'

# Dump database
gem 'seed_dump',                '~> 3.2.2'

# Dummy data
gem 'factory_girl_rails',       '~> 4.5.0'
gem 'faker',                    '~> 1.6.1'

# HTTP Response
gem 'responders',               '~> 2.1.0'
gem 'http_accept_language',     '~> 2.0.2'
gem 'secure_headers',           '~> 2.4.3'

# JSON
gem 'active_model_serializers', '~> 0.10.0.rc3'

# Use slim instead of erb
gem 'slim-rails',               '~> 3.0.1'

# Internationalization
gem 'globalize',                '~> 5.0.1'
# 3.0.0.rc11 bugged, generate translations twice in the same file
gem 'i18n-js',                  '= 3.0.0.rc9'
gem 'geocoder',                 '~> 1.2.12'
gem 'maxminddb',                '~> 0.1.8'

# Model versioning
gem 'paper_trail',              '~> 4.0.0'
gem 'globalize-versioning',     git: 'https://github.com/globalize/globalize-versioning.git'

# Run asynschronous process
gem 'sidekiq',                  '~> 4.0.1'
gem 'sidekiq-statistic',        '~> 1.1'
gem 'sidekiq-cron',             '~> 0.4.0'
gem 'sinatra',                  '~> 1.4.5',     require: false
gem 'whenever',                 '~> 0.9.4',     require: false

# Redis session store and cache
gem 'redis-namespace',          '~> 1.5.2'
gem 'redis-session-store',      '~> 0.8.0'
gem 'readthis',                 '~> 1.1.0'
gem 'hiredis',                  '~> 0.6.0'

# Global variables
gem 'simpleconfig',             '~> 2.0.1'

# Authentification
gem 'devise',                   '~> 3.5.2'

# Authorization mechanism
gem 'pundit',                   '~> 1.0.1'

# Human-friendly URLs
gem 'friendly_id',              '~> 5.1.0'

# Pagination
gem 'will_paginate',            '~> 3.0.7'

# Forms
gem 'simple_form',              '~> 3.2.0'
gem 'country_select',           '~> 2.5.1'

# Upload pictures
gem 'carrierwave',              '~> 0.10.0'
gem 'carrierwave_backgrounder', '~> 0.4.2'
gem 'mini_magick',              '~> 4.3.5'

# Search in database
gem 'searchkick',               '~> 1.1.0'

# Comments
gem 'acts_as_commentable_with_threading', '~> 2.0'

# Errors management
gem 'rails_exception_handler',  git: 'https://github.com/Sharagoz/rails_exception_handler.git'

# Deployment
gem 'capistrano',               '~> 3.4.0'
gem 'capistrano-rails',         '~> 1.1.5'
gem 'capistrano-rvm',           '~> 0.1.1',   require: false
gem 'capistrano-bundler',       '~> 1.1.4',   require: false
gem 'capistrano-rails-console', '~> 1.0.1',   require: false
gem 'capistrano-db-tasks',      '~> 0.4',     require: false
gem 'capistrano-sidekiq',       '~> 0.5.4',   require: false

# Website analysis
gem 'newrelic_rpm',             '~> 3.14.0.305'

group :development do
  # server
  gem 'thin',                   '~> 1.6.4'

  # Debugging tool
  gem 'pry-rails',              '~> 0.3.3'
  gem 'awesome_print',          '~> 1.6.1'

  # Improve errors
  gem 'better_errors',          '~> 2.1.1'
  gem 'binding_of_caller',      '~> 0.7.2'

  # Turn off unnecessary log output
  gem 'quiet_assets',           '~> 1.1.0'

  # Scss lint
  gem 'scss-lint',              '~> 0.38.0', require: false

  # Guard and its minions
  gem 'guard',                  '~> 2.13.0'
  gem 'guard-rails',            '~> 0.7.2'
  gem 'guard-annotate',         '~> 2.2'
  gem 'guard-bundler',          '~> 2.1.0'
  gem 'guard-migrate',          '~> 1.2.1'
  gem 'guard-rake',             '~> 1.0.0'
  gem 'guard-rspec',            '~> 4.6.4',  require: false
  gem 'guard-sidekiq',          '~> 0.1.0'
  gem 'guard-process',          '~> 1.2.1'
  gem 'libnotify',              '~> 0.9.1'

  # Benchmarks and performance analysis
  gem 'flamegraph',             '~> 0.1.0'
  gem 'stackprof',              '~> 0.2.7'
  gem 'rack-mini-profiler',     '~> 0.9.8'
  gem 'memory_profiler',        '~> 0.9.6'

  # N+1 database query
  gem 'bullet',                 '~> 4.14.10'

  # Find index to add
  gem 'lol_dba',                '~> 2.0.1'

  # Faster ruby code
  gem 'fasterer',               '~> 0.1.11'
end

group :test do
  # Test tools
  gem 'rspec-rails',            '~> 3.4.0'
  gem 'capybara',               '~> 2.5.0'
  gem 'capybara-email',         '~> 2.4.0'
  gem 'capybara-webkit',        '~> 1.7.0'
  gem 'capybara-screenshot',    '~> 1.0.11'
  gem 'launchy',                '~> 2.4.3'
  gem 'shoulda-matchers',       '~> 3.0.1',   require: false
  gem 'html_validation',        '~> 1.1.3'
  gem 'spork',                  '~> 0.9.2'
  gem 'simplecov',              '~> 0.11.1',  require: false
  gem 'fuubar',                 '~> 2.0.0'
  gem 'database_cleaner',       '~> 1.5.1'
  gem 'spring-commands-rspec',  '~> 1.0.4'

  # static analyzer
  gem 'rails_best_practices',   '~> 1.15.7',  require: false
  gem 'brakeman',               '~> 3.1.2',   require: false
  gem 'metric_fu',              '~> 4.12.0',  require: false
  gem 'i18n-tasks',             '~> 0.9.2',   require: false
  gem 'deadweight',             '~> 0.2.2',   require: false

  # Security
  gem 'dawnscanner',            '~> 1.5.0',   require: false
end

group :development, :test do
  # Speed up server and tests
  gem 'spring',                 '~> 1.5.0'

  # Check errors
  gem 'rubocop',                '~> 0.35.1',  require: false
end

group :production do
  # server
  gem 'passenger', '~> 5'

  # Improve Json generation (Oj not working with rack-mini-profiler)
  gem 'oj',                       '~> 2.14.0'
  gem 'oj_mimic_json',            '~> 1.0.1'
end
