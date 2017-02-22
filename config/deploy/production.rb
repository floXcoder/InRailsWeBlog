set :stage, :production
set :rails_env, 'production'

role :app, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :web, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :db, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]
role :production, [ENV['DEPLOY_USER'] + '@' + ENV['DEPLOY_SERVER']]

server ENV['DEPLOY_SERVER'], user: ENV['DEPLOY_USER'], roles: %w{web app db production}, primary: true

set :branch, 'master'

set :deploy_to, "/var/www/#{fetch(:application)}/production"
