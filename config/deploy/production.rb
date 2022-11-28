# frozen_string_literal: true

set :stage, :production
set :rails_env, 'production'

set :default_env, {
  'RAILS_ENV' => 'production',
  'NODE_ENV' => 'production'
}

role :app, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :web, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :db, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :production, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]

set :rvm_ruby_version, ENV['DEPLOY_GEMSET']

set :console_env, :production
set :console_shell, 'export RAILS_ENV=production && /bin/bash'

server ENV['DEPLOY_SERVER'], user: ENV['DEPLOY_USER'], roles: %w[web app db production], primary: true

set :branch, 'master'

set :deploy_to, "/home/www/#{fetch(:application)}/production"
