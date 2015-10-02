set :stage, :production

role :app, %w{lx@91.121.157.101}
role :web, %w{lx@91.121.157.101}
role :db,  %w{lx@91.121.157.101}

server '91.121.157.101', user: 'lx', roles: %w{web app db}, primary: true

set :branch, 'master'

set :deploy_to, "/var/www/#{fetch(:application)}"

set :rails_env, 'production'
