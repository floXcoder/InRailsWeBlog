lock '3.4.0'

set :application, 'InRailsWeBlog'
set :repo_url, 'git@gitlab.l-x.fr:Flo/InRailsWeBlog.git'

# rvm properties
set :rvm_type, :user

# Set the user (the server is setup with a RSA key to access without password)
set :user, 'lx'

# Default value for :scm is :git
set :scm, :git

# Don't need it
set :use_sudo, false

# Default value for :format is :pretty
set :format, :pretty

# Update method : clone the entire repository
# Faster method : remote_cache but required further authentification
set :deploy_via, :remote_cache

# SSH options : use an "agent forwarding" to connect to the remote repository
set :ssh_options, {
  forward_agent: true,
  port: 7070
}

# Specify how many releases Capistrano should store on your server
set :keep_releases, 5

# Ensure any needed password prompts from SSH show up in your terminal so you can handle them
# But there is a bug when it set to true with sidekiq
set :pty, false

# Default value for :log_level is :debug
set :log_level, :debug

# files we want symlinking to specific entries in shared.
set :linked_files, %w{config/application.yml config/sidekiq.yml}

# dirs we want symlinking to shared
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/uploads public/system}

# what specs should be run before deployment is allowed to
# continue, see lib/capistrano/tasks/run_tests.cap
# set :tests, []

# Compile assets
set :assets_roles, [:app]

# Parallelize the installation of gems
set :bundle_jobs, 4

# Sidekiq configuration from file
set :sidekiq_config, -> { File.join(shared_path, 'config', 'sidekiq.yml') }

## Synchronize local database with server database ##

# if you want to remove the local dump file after loading
set :db_local_clean, true

# if you want to remove the dump file from the server after downloading
set :db_remote_clean, true

# if you want to work on a specific local environment (default = ENV['RAILS_ENV'] || 'development')
set :locals_rails_env, 'production'

# if you are highly paranoid and want to prevent any push operation to the server
set :disallow_pushing, false

namespace :assets do
  desc 'Publish assets'
  task :publish do
    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :npm, :run, 'deploy'
        end
      end
    end
  end

  after 'deploy:updated', 'assets:publish'
end

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:web), in: :sequence, wait: 5 do
      execute :sudo, '/etc/init.d/apache2 restart'
    end
  end

  # Configure server to run these commands without password
  desc 'Reset database'
  task :reset_database do
    on roles(:app) do
      on primary :db do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute :sudo, '/etc/init.d/apache2 stop'
            execute :sudo, '/etc/init.d/postgresql restart'
            execute :rake, 'InRailsWeBlog:populate[reset]'
            execute :sudo, '/etc/init.d/apache2 start'
          end
        end
      end
    end
  end

  desc 'Index elastic search'
  task :index_elasticsearch do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'searchkick:reindex CLASS=Article'
        end
      end
    end
  end

  # after :publishing, :reset_database
  # after :publishing, :index_elasticsearch
  after :publishing, :restart

  after :finishing, :cleanup
end

# Commands:
# cap production deploy
# cap production deploy:reset_database
