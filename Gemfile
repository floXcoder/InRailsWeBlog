source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby file: '.ruby-version'

# Rails version
gem 'rails',                    '7.1.3.4'

# Use postgresql as the database for Active Record
gem 'pg',                       '1.5.6'
# gem 'active_record_extended',   '1.4.0'

# HTTP Response
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '6.5.0'

# JSON
gem 'jsonapi-serializer',       '2.2.0'
gem 'oj',                       '3.16.4'

# Use slim instead of erb
gem 'slim-rails',               '3.6.3'

# Internationalization
gem 'i18n-js',                  '4.2.3'
gem 'geocoder',                 '1.8.3'
gem 'maxminddb',                '0.1.22'

# Model versioning
gem 'paper_trail',              '15.1.0'

# Marked as deleted
gem 'paranoia',                 '2.6.3'

# Format user input
gem 'auto_strip_attributes',    '2.6.0'
gem 'sanitize',                 '6.1.1'

# Run asynschronous process
gem 'sidekiq',                  '7.3.0'

# Redis session store and cache
gem 'redis-namespace',          '1.11.0'
gem 'redis-session-store',      '0.11.5'
gem 'connection_pool',          '2.4.1'

# Authentification
gem 'devise',                   '4.9.4'

# Authorization mechanism
gem 'pundit',                   '2.3.2'

# Upload pictures
gem 'carrierwave',              '3.0.7'
gem 'mini_magick',              '4.13.1'
gem 'image_processing',         '1.12.2'

# Search in database
gem 'searchkick',               '5.3.1'
gem 'elasticsearch',            '8.14.0'
gem 'typhoeus',                 '1.4.1'

# CSV
gem 'csv',                      '3.3.0',    require: false

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Email formater
gem 'premailer-rails',          '1.12.0'

# Detect browser and bots
gem 'browser',                  '6.0.0'

# Tracking
gem 'ahoy_matey',               '5.1.0'

# SEO
gem 'friendly_id',              '5.5.1'
gem 'route_translator',         '14.1.2'
gem 'meta-tags',                '2.21.0'
gem 'sitemap_generator',        '6.3.0'

# Dummy data
gem 'factory_bot_rails',        '6.4.3',  require: false
gem 'faker',                    '3.4.1',  require: false

# Deployment
gem 'capistrano',               '3.19.1', require: false
gem 'capistrano-rails',         '1.6.3',  require: false
gem 'capistrano-rvm',           '0.1.2',  require: false
gem 'capistrano-bundler',       '2.1.0',  require: false
gem 'health_check',             '3.1.0'
gem 'net-ssh',                  '7.2.3'
gem 'ed25519',                  '1.3.0'
gem 'bcrypt_pbkdf',             '1.1.1'

# SEO
gem 'selenium-webdriver',       '4.22.0', require: false

# Server
gem 'puma',                     '6.4.2'

group :development do
  # Debugging tool
  gem 'awesome_print',          '1.9.2'

  # Improve errors
  gem 'better_errors',          '2.10.1'
  gem 'binding_of_caller',      '1.0.1'

  # N+1 database query
  gem 'bullet',                 '7.1.6'

  # Guard and its minions
  gem 'guard',                  '2.18.1', require: false
  gem 'guard-bundler',          '3.0.1',  require: false
  gem 'guard-sidekiq',          '0.1.0',  require: false
  gem 'guard-process',          '1.2.1',  require: false

  # Annotate models from DB
  gem 'annotate',               '3.2.0',  require: false

  # Load tests
  gem 'ruby-jmeter',            '3.1.08', require: false
end

group :test do
  # Test tools
  gem 'rspec-rails',                '6.1.3'
  gem 'webmock',                    '3.23.1'
  gem 'shoulda-matchers',           '6.2.0',  require: false
  gem 'shoulda-callback-matchers',  '1.1.4',  require: false
  gem 'simplecov',                  '0.22.0', require: false
  gem 'fuubar',                     '2.5.1'
  gem 'database_cleaner',           '2.0.2'
  gem 'db-query-matchers',          '0.12.0'
end

group :development, :test do
  # Speed up boot
  gem 'bootsnap',                   '1.18.3', require: false

  # Check errors
  gem 'rubocop',                    '1.64.1',  require: false
  gem 'rubocop-rails',              '2.25.1',  require: false
  gem 'rubocop-rspec',              '3.0.2',   require: false
  gem 'rubocop-performance',        '1.21.1',  require: false
  gem 'rubocop-capybara',           '2.21.0',  require: false
  gem 'rubocop-factory_bot',        '2.26.1',  require: false

  # static analyzer
  gem 'rails_best_practices',       '1.23.2', require: false
  gem 'brakeman',                   '6.1.2',  require: false
  gem 'i18n-tasks',                 '1.0.14', require: false
end

group :production do
  # Scheduler
  gem 'whenever',         '1.0.0', require: false

  # Errors reporting
  gem 'sentry-ruby',      '5.18.1'
  gem 'sentry-rails',     '5.18.1'
  gem 'sentry-sidekiq',   '5.18.1'
  gem 'stackprof',        '0.2.26'

  # Check slow DB requests
  gem 'pghero',           '3.5.0'
  gem 'pg_query',         '5.1.0'

  # Improve log outputs
  gem 'lograge',          '0.14.0'

  # Prerender html pages for SEO
  gem 'seo_cache',        '2.0.0',   require: false
end
