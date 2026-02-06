source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Specify exact Ruby version (mandatory)
ruby file: '.ruby-version'

# Rails version
gem 'rails',                    '8.1.2'

# Use postgresql as the database for Active Record
gem 'pg',                       '1.6.3'

# HTTP Response
gem 'http_accept_language',     '2.1.1'
gem 'secure_headers',           '7.1.0', require: false

# JSON
gem 'json',                     '2.18.1'
gem 'jsonapi-serializer',       '2.2.0'

# Use slim instead of erb
gem 'slim-rails',               '4.0.0'

# Internationalization
gem 'i18n-js',                  '4.2.4'
gem 'geocoder',                 '1.8.6', require: false
gem 'maxminddb',                '0.1.22', require: false

# Model versioning
gem 'paper_trail',              '17.0.0'

# Marked as deleted
gem 'paranoia',                 '3.1.0'

# Format user input
gem 'auto_strip_attributes',    '2.6.0'
gem 'sanitize',                 '7.0.0'

# Run asynschronous process
gem 'good_job',                 '4.13.2'

# Redis session store and cache
gem 'redis-namespace',          '1.11.0'
gem 'redis-session-store',      '0.11.6'
gem 'connection_pool',          '3.0.2'

# Authentification
gem 'devise',                   '5.0.0'

# Authorization mechanism
gem 'pundit',                   '2.5.2'

# Upload pictures
gem 'carrierwave',              '3.1.2'
gem 'mini_magick',              '5.3.1',  require: false
gem 'image_processing',         '1.14.0', require: false

# Search in database
gem 'typhoeus',                 '1.5.0'
gem 'elasticsearch',            '9.3.0'
gem 'searchkick',               '6.0.3'

# CSV
gem 'csv',                      '3.3.5',  require: false

# OpenStruct
gem 'ostruct',                  '0.6.3', require: false

# Comments
gem 'acts_as_commentable_with_threading', '2.0.1'

# Email formater
gem 'premailer-rails',          '1.12.0', require: false

# Detect browser and bots
gem 'browser',                  '6.2.0'

# Tracking
gem 'ahoy_matey',               '5.4.1'

# SEO
gem 'friendly_id',              '5.6.0'
gem 'route_translator',         '15.2.0'
gem 'meta-tags',                '2.22.3'
gem 'sitemap_generator',        '6.3.0', require: false

# SEO
gem 'selenium-webdriver',       '4.40.0', require: false

# Server
gem 'puma',                     '7.2.0'

group :development do
  # Debugging tool
  gem 'awesome_print',          '1.9.2'
  gem 'terminal-table',         '4.0.0'

  # Improve errors
  gem 'better_errors',          '2.10.1'
  gem 'binding_of_caller',      '1.0.1'

  # N+1 database query
  gem 'bullet',                 '8.1.0', require: false

  # Guard and its minions
  gem 'guard',                  '2.20.1', require: false
  gem 'guard-bundler',          '3.1.0',  require: false
  gem 'guard-process',          '1.2.1',  require: false

  # Annotate models from DB
  gem 'annotaterb',             '4.21.0',  require: false

  # Load tests
  gem 'ruby-jmeter',            '3.1.08', require: false

  # Deployment
  gem 'capistrano',             '3.20.0', require: false
  gem 'capistrano-rails',       '1.7.0',  require: false
  gem 'capistrano-rvm',         '0.1.2',  require: false
  gem 'capistrano-bundler',     '2.2.0',  require: false
  gem 'net-ssh',                '7.3.0',  require: false
  gem 'ed25519',                '1.4.0',  require: false
  gem 'bcrypt_pbkdf',           '1.1.2',  require: false
end

group :test do
  # Test tools
  gem 'rspec-rails',                '8.0.2'
  gem 'webmock',                    '3.26.1'
  gem 'shoulda-matchers',           '7.0.1',  require: false
  gem 'shoulda-callback-matchers',  '1.1.4',  require: false
  gem 'simplecov',                  '0.22.0', require: false
  gem 'fuubar',                     '2.5.1'
  gem 'database_cleaner',           '2.1.0'
  gem 'db-query-matchers',          '0.15.0'

  # Dummy data
  gem 'factory_bot_rails',        '6.5.1',  require: false
  gem 'faker',                    '3.6.0',  require: false
end

group :development, :test do
  # Speed up boot
  gem 'bootsnap',                   '1.22.0', require: false

  # Check errors
  gem 'rubocop',                    '1.84.1',  require: false
  gem 'rubocop-rails',              '2.34.3',  require: false
  gem 'rubocop-rspec',              '3.9.0',   require: false
  gem 'rubocop-performance',        '1.26.1',  require: false
  gem 'rubocop-capybara',           '2.22.1',  require: false
  gem 'rubocop-factory_bot',        '2.28.0',  require: false

  # static analyzer
  gem 'rails_best_practices',       '1.23.3', require: false
  gem 'brakeman',                   '8.0.2',  require: false
  gem 'i18n-tasks',                 '1.1.2', require: false
end

group :production do
  # Scheduler
  gem 'whenever',         '1.1.2', require: false

  # Errors reporting
  # gem 'vernier',        '1.5.0'
  gem 'sentry-ruby',      '6.3.0'
  gem 'sentry-rails',     '6.3.0'
  gem 'stackprof',        '0.2.27'

  # Check slow DB requests
  gem 'pghero',           '3.7.0'

  # Check website health
  gem 'health_check',     '3.1.0'

  # Improve log outputs
  gem 'lograge',          '0.14.0'

  # Prerender html pages for SEO
  gem 'seo_cache',        '2.0.0',   require: false
end
