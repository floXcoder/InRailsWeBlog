source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby '2.5.1'

# Rails version
gem 'rails',                    '5.2.2'

# Use postgresql as the database for Active Record
gem 'pg',                       '1.1.4'

# HTTP Response
gem 'responders',               '2.4.1'
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '6.0.0'

# JSON
gem 'active_model_serializers', '0.10.9'
gem 'oj',                       '3.7.9'

# Use slim instead of erb
gem 'slim-rails',               '3.2.0'

# Internationalization
gem 'i18n-js',                  '3.2.1'
gem 'geocoder',                 '1.5.1'
gem 'maxminddb',                '0.1.22'

# Model versioning
gem 'paper_trail',              '10.2.0'

# Marked as deleted
gem 'paranoia',                 '2.4.1'

# User activities
gem 'public_activity',          '1.6.3'

# Format user input
gem 'auto_strip_attributes',    '2.5.0'
gem 'sanitize',                 '5.0.0'

# Run asynschronous process
gem 'sidekiq',                  '5.2.5'
gem 'sidekiq-statistic',        github: 'davydovanton/sidekiq-statistic'
gem 'sidekiq-cron',             '1.1.0'
gem 'sidekiq-status',           '1.1.1'
gem 'attentive_sidekiq',        '0.3.3'
gem 'sidekiq-benchmark',        '0.6.0'
gem 'whenever',                 '0.10.0', require: false

# Redis session store and cache
gem 'redis-namespace',          '1.6.0'
gem 'redis-session-store',      '0.11.0'
gem 'readthis',                 '2.2.0'
gem 'hiredis',                  '0.6.3'
gem 'redis-rack-cache',         '2.0.2'

# Global and model settings
gem 'simpleconfig',             '2.0.1'
gem 'rails-settings-cached',    '0.7.2'
gem 'storext',                  '2.2.2'

# Authentification
gem 'devise',                   '4.6.1'

# Authorization mechanism
gem 'pundit',                   '2.0.1'

# Upload pictures
gem 'carrierwave',              '1.3.1'
gem 'carrierwave-imageoptimizer', '1.4.0'
gem 'mini_magick',              '4.9.2'

# Search in database
gem 'searchkick',               '3.1.2'
gem 'typhoeus',                 '1.3.1'

# Votable models
gem 'thumbs_up',                '0.6.9'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Prevent DDOS attacks
gem 'rack-attack',              '5.4.2'

# Manage errors
gem 'browser',                  '2.5.3'

# SEO
gem 'friendly_id',              '5.2.5'
gem 'meta-tags',                '2.11.1'

# HTTP request
gem 'http',                     '4.0.5'

# Dummy data
gem 'factory_bot_rails',        '5.0.1',   require: false
gem 'faker',                    '1.9.3',   require: false

# Deployment
gem 'capistrano',               '3.11.0'
gem 'capistrano-rails',         '1.4.0'
gem 'capistrano-rvm',           '0.1.2',   require: false
gem 'capistrano-bundler',       '1.5.0',   require: false
gem 'capistrano-rails-console', '2.3.0',   require: false
gem 'capistrano-db-tasks',      '0.6',     require: false
gem 'capistrano-sidekiq',       '1.0.2',   require: false
gem 'capistrano-passenger',     '0.2.0',   require: false
gem 'health_check',             '3.0.0'

group :development do
  # server
  gem 'puma',                   '3.12.0'

  # Debugging tool
  gem 'pry-rails',              '0.3.9'
  gem 'awesome_print',          '1.8.0'

  # Improve errors
  gem 'better_errors',          '2.5.1'
  gem 'binding_of_caller',      '0.8.0'

  # N+1 database query
  gem 'bullet',                 '5.9.0'

  # Scss lint
  gem 'scss-lint',              '0.38.0', require: false

  # Guard and its minions
  gem 'guard',                  '2.15.0'
  gem 'guard-rails',            '0.8.1'
  gem 'guard-annotate',         '2.3'
  gem 'guard-bundler',          '2.2.1'
  gem 'guard-migrate',          '2.0.0'
  # gem 'guard-rake',             '1.0.0'
  # gem 'guard-rspec',            '4.7.3',  require: false
  gem 'guard-sidekiq',          '0.1.0'
  gem 'guard-process',          '1.2.1'

  # Find index to add
  gem 'lol_dba',                '2.1.5', require: false
  gem 'unique_validation_inspector', '0.3.0', require: false

  # Faster ruby code
  gem 'fasterer',               '0.4.2', require: false

  # Load tests
  gem 'ruby-jmeter',            '3.1.08', require: false
end

group :test do
  # Test tools
  gem 'rspec-rails',            '3.8.2'
  gem 'shoulda-matchers',       '4.0.0',    require: false
  gem 'shoulda-callback-matchers', '1.1.4', require: false
  gem 'simplecov',              '0.16.1',   require: false
  gem 'fuubar',                 '2.3.2'
  gem 'database_cleaner',       '1.7.0'
  gem 'db-query-matchers',      '0.9.0'

  # Browser tests
  gem 'capybara',               '3.13.2'
  gem 'capybara-email',         '3.0.1'
  gem 'capybara-screenshot',    '1.0.22'
  gem 'selenium-webdriver',     '3.141.0'
  gem 'chromedriver-helper',    '2.1.0'
  gem 'html_validation',        '1.1.5'
  gem 'launchy',                '2.4.3'

  # static analyzer
  gem 'rails_best_practices',   '1.19.4',   require: false
  gem 'brakeman',               '4.4.0',    require: false
  gem 'i18n-tasks',             '0.9.28',   require: false
end

group :development, :test do
  # Check errors
  gem 'rubocop',                '0.65.0',  require: false
  gem 'rubocop-rspec',          '1.32.0',  require: false

  # Speed up boot
  gem 'bootsnap',               '1.4.0',   require: false
end

group :production do
  # Errors reporting
  gem 'sentry-raven',     '2.9.0'

  # Improve log outputs
  gem 'lograge',          '0.10.0'

  # Website analysis
  gem 'newrelic_rpm',     '6.0.0.351'

  # Prerender html pages for SEO
  gem 'prerender_rails',  '1.6.0'
end
