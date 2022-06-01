source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby '3.1.2'

# Rails version
gem 'rails',                    '7.0.3'

# Use postgresql as the database for Active Record
gem 'pg',                       '1.3.5'
# gem 'active_record_extended',   '1.4.0'

# HTTP Response
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '6.3.3'

# JSON
gem 'jsonapi-serializer',       '2.2.0'
gem 'oj',                       '3.13.13'

# Use slim instead of erb
gem 'slim-rails',               '3.5.1'

# Internationalization
gem 'i18n-js',                  '3.9.2'
gem 'geocoder',                 '1.8.0'

# Model versioning
gem 'paper_trail',              '12.3.0'

# Marked as deleted
gem 'paranoia',                 '2.6.0'

# Format user input
gem 'auto_strip_attributes',    '2.6.0'
gem 'sanitize',                 '6.0.0'

# Run asynschronous process
gem 'sidekiq',                  '6.4.2'
gem 'sidekiq-cron',             '1.4.0'
gem 'whenever',                 '1.0.0', require: false

# Redis session store and cache
gem 'redis-namespace',          '1.8.2'
gem 'redis-session-store',      '0.11.4'
gem 'hiredis',                  '0.6.3'

# Global and model settings
gem 'storext',                  '3.3.0', github: 'erikaxel/storext'

# Authentification
gem 'devise',                   '4.8.1'

# Authorization mechanism
gem 'pundit',                   '2.2.0'

# Upload pictures
gem 'carrierwave',              '2.2.2'
gem 'mini_magick',              '4.11.0'
gem 'image_processing',         '1.12.2'

# Search in database
gem 'searchkick',               '5.0.3'
gem 'elasticsearch',            '7.13.3'
gem 'typhoeus',                 '1.4.0'

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Email formater
gem 'premailer-rails',          '1.11.1'

# Detect browser and bots
gem 'browser',                  '5.3.1'

# Tracking
gem 'ahoy_matey',               '4.0.3'

# SEO
gem 'friendly_id',              '5.4.2'
gem 'route_translator',         '12.1.0'
gem 'meta-tags',                '2.16.0'
gem 'sitemap_generator',        '6.2.1'

# Dummy data
gem 'factory_bot_rails',        '6.2.0',  require: false
gem 'faker',                    '2.21.0', require: false

# Deployment
gem 'capistrano',               '3.17.0', require: false
gem 'capistrano-rails',         '1.6.2',  require: false
gem 'capistrano-rvm',           '0.1.2',  require: false
gem 'capistrano-bundler',       '2.1.0',  require: false
gem 'health_check',             '3.1.0'

# SEO
gem 'webdrivers',               '5.0.0',  require: false
gem 'selenium-webdriver',       '4.2.1',  require: false

# Server
gem 'puma',                     '5.6.4'

group :development do
  # Debugging tool
  gem 'pry-rails',              '0.3.9'
  gem 'awesome_print',          '1.9.2'

  # Improve errors
  gem 'better_errors',          '2.9.1'
  gem 'binding_of_caller',      '1.0.0'

  # N+1 database query
  gem 'bullet',                 '7.0.2'

  # Guard and its minions
  gem 'guard',                  '2.18.0', require: false
  gem 'guard-rails',            '0.8.1',  require: false
  gem 'guard-bundler',          '3.0.0',  require: false
  gem 'guard-migrate',          '2.0.0',  require: false
  gem 'guard-sidekiq',          '0.1.0',  require: false
  gem 'guard-process',          '1.2.1',  require: false

  # Annotate models from DB
  gem 'annotate',               '3.2.0',  require: false

  # Load tests
  gem 'ruby-jmeter',            '3.1.08', require: false
end

group :test do
  # Test tools
  gem 'rspec-rails',                '5.1.2'
  gem 'webmock',                    '3.14.0'
  gem 'shoulda-matchers',           '5.1.0',  require: false
  gem 'shoulda-callback-matchers',  '1.1.4',  require: false
  gem 'simplecov',                  '0.21.2', require: false
  gem 'fuubar',                     '2.5.1'
  gem 'database_cleaner',           '2.0.1'
  gem 'db-query-matchers',          '0.11.0'
end

group :development, :test do
  # Speed up boot
  gem 'bootsnap',                   '1.12.0',  require: false

  # Check errors
  gem 'rubocop',                    '1.30.0', require: false
  gem 'rubocop-rails',              '2.14.2', require: false
  gem 'rubocop-performance',        '1.14.0', require: false
  gem 'rubocop-rspec',              '2.11.1',  require: false

  # static analyzer
  gem 'rails_best_practices',       '1.23.1', require: false
  gem 'brakeman',                   '5.2.3',  require: false
  gem 'i18n-tasks',                 '1.0.10',  require: false
end

group :production do
  # Errors reporting
  gem 'sentry-raven',     '3.1.2'

  # Check slow DB requests
  gem 'pghero',           '2.8.3'
  gem 'pg_query',         '2.1.3'

  # Improve log outputs
  gem 'lograge',          '0.12.0'

  # Prerender html pages for SEO
  gem 'seo_cache',        '1.2.2',   require: false
end
