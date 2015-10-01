source 'https://rubygems.org'

ruby '2.2.3'

gem 'rails',                    '4.2.4'

# Use postgresql as the database for Active Record
gem 'pg',                       '~> 0.18.3'

# Responders format
gem 'responders',               '~> 2.1.0'

# JSON
gem 'jbuilder',                 '~> 2.3.1'

# Use slim instead of erb
gem 'slim-rails',               '~> 3.0.1'

# Internationalization
gem 'http_accept_language',     '~> 2.0.2'

# Run asynschronous process
gem 'sidekiq',                  '~> 3.5.0'
gem 'sinatra',                  '~> 1.4.5',     require: false
gem 'whenever',                 '~> 0.9.4',     require: false

group :development do
  # server
  gem 'thin', '~> 1.6.3'

  # Debugging tool
  gem 'pry-rails',              '~> 0.3.3'
  gem 'awesome_print',          '~> 1.6.1'

  # Improve errors
  gem 'better_errors',          '~> 2.1.1'
  gem 'binding_of_caller',      '~> 0.7.2'

  # Turn off unnecessary log output
  gem 'quiet_assets',           '~> 1.1.0'
end

group :test do

end

group :development, :test do
  # Speed up server and tests
  gem 'spring',   '~> 1.4.0'
end

group :production do
  # server
  gem 'passenger', '~> 5.0.18'
end
