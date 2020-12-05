source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby '2.6.3'

# Rails version
gem 'rails',                    '6.0.3.4'

# Use postgresql as the database for Active Record
gem 'pg',                       '1.2.3'
gem 'active_record_extended',   '1.4.0'
gem 'pghero',                   '2.7.3'
gem 'pg_query',                 '1.2.0' # Required for pghero

# HTTP Response
gem 'responders',               '3.0.1'
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '6.3.1'
gem 'faraday',                  '1.1.0'

# JSON
gem 'jsonapi-serializer',       '2.1.0'
gem 'oj',                       '3.10.16'

# Use slim instead of erb
gem 'slim-rails',               '3.2.0'

# Internationalization
gem 'i18n-js',                  '3.8.0'
gem 'geocoder',                 '1.6.4'
gem 'maxminddb',                '0.1.22'

# Model versioning
gem 'paper_trail',              '11.0.0'

# Marked as deleted
gem 'paranoia',                 '2.4.2'

# Format user input
gem 'auto_strip_attributes',    '2.6.0'
gem 'sanitize',                 '5.2.1'

# Run asynschronous process
gem 'sidekiq',                  '6.1.2'
gem 'sidekiq-statistic',        '1.4.0'
gem 'sidekiq-cron',             '1.2.0'
gem 'attentive_sidekiq',        '0.3.3'
gem 'whenever',                 '1.0.0', require: false

# Redis session store and cache
gem 'redis-namespace',          '1.8.0'
gem 'redis-session-store',      '0.11.3'
gem 'hiredis',                  '0.6.3'

# Global and model settings
gem 'storext',                  '3.1.0'

# Authentification
gem 'devise',                   '4.7.3'

# Authorization mechanism
gem 'pundit',                   '2.1.0'

# Upload pictures
gem 'carrierwave',              '2.1.0'
gem 'mini_magick',              '4.11.0'

# Search in database
gem 'searchkick',               '4.4.2'
gem 'typhoeus',                 '1.4.0'

# Votable models
gem 'thumbs_up',                '0.6.10'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Email formater
gem 'premailer-rails',          '1.11.1'

# Detect browser and bots
gem 'browser',                  '5.1.0'

# Tracking
gem 'ahoy_matey',               '3.1.0'

# SEO
gem 'friendly_id',              '5.4.1'
gem 'route_translator',         '9.0.0'
gem 'meta-tags',                '2.13.0'
gem 'sitemap_generator',        '6.1.2'

# Dummy data
gem 'factory_bot_rails',        '6.1.0',   require: false
gem 'faker',                    '2.15.1',  require: false

# Deployment
gem 'capistrano',               '3.14.1'
gem 'capistrano-rails',         '1.6.1'
gem 'capistrano-rvm',           '0.1.2',   require: false
gem 'capistrano-bundler',       '2.0.1',   require: false
gem 'capistrano-rails-console', '2.3.0',   require: false
gem 'capistrano-db-tasks',      '0.6',     require: false
gem 'health_check',             '3.0.0'

# SEO
gem 'webdrivers',               '4.4.1'

# Server
gem 'puma',                     '5.1.0'

group :development do
  # Debugging tool
  gem 'pry-rails',              '0.3.9'
  gem 'awesome_print',          '1.8.0'

  # Improve errors
  gem 'better_errors',          '2.9.1'
  gem 'binding_of_caller',      '0.8.0'

  # N+1 database query
  gem 'bullet',                 '6.1.0'

  # Guard and its minions
  gem 'guard',                  '2.16.2'
  gem 'guard-rails',            '0.8.1'
  gem 'guard-bundler',          '3.0.0'
  gem 'guard-migrate',          '2.0.0'
  gem 'guard-sidekiq',          '0.1.0'
  gem 'guard-process',          '1.2.1'

  # Annotate models from DB
  gem 'annotate',               '3.1.1'

  # Find index to add
  # gem 'lol_dba',                '2.1.8', require: false # Not compatible with Rails 6
  #gem 'unique_validation_inspector', '0.3.0', require: false

  # Faster ruby code
  gem 'fasterer',               '0.8.3', require: false

  # Load tests
  gem 'ruby-jmeter',            '3.1.08', require: false
end

group :test do
  # Test tools
  gem 'rspec-rails',                '4.0.1'
  gem 'webmock',                    '3.10.0'
  gem 'rspec_junit_formatter',      '0.4.1'
  gem 'shoulda-matchers',           '4.4.1',  require: false
  gem 'shoulda-callback-matchers',  '1.1.4',  require: false
  gem 'simplecov',                  '0.20.0', require: false
  gem 'fuubar',                     '2.5.0'
  gem 'database_cleaner',           '1.8.5'
  gem 'db-query-matchers',          '0.10.0'

  # Browser tests
  gem 'capybara',                   '3.34.0'
  gem 'capybara-email',             '3.0.2'
  gem 'capybara-screenshot',        '1.0.25'
  gem 'selenium-webdriver',         '3.142.7'
  gem 'html_validation',            '1.1.5'
  gem 'launchy',                    '2.5.0'

  # static analyzer
  gem 'rails_best_practices',       '1.20.0',   require: false
  gem 'brakeman',                   '4.10.0',    require: false
  gem 'i18n-tasks',                 '0.9.31',   require: false
end

group :development, :test do
  # Speed up boot
  gem 'bootsnap',                   '1.5.1',   require: false

  # Check errors
  gem 'rubocop',                    '1.5.2',  require: false
  gem 'rubocop-rails',              '2.8.1',   require: false
  gem 'rubocop-performance',        '1.9.1',   require: false
  gem 'rubocop-rspec',              '2.0.1',  require: false
end

group :production do
  # Errors reporting
  gem 'sentry-raven',     '3.1.1'

  # Improve log outputs
  gem 'lograge',          '0.11.2'

  # Prerender html pages for SEO
  gem 'seo_cache',        '1.0.1'
end
