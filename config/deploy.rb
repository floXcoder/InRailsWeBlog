# frozen_string_literal: true

lock '3.11.2'

set :application, 'InRailsWeBlog'
set :repo_url, ENV['GIT_REPO_ADDRESS']

# rvm properties
set :rvm_type, :user
set :rvm_map_bins, fetch(:rvm_map_bins, []).push('rvmsudo')

# Set the user (the server is setup with a RSA key to access without password)
set :user, ENV['GIT_REPO_USER']

# Don't need it
set :use_sudo, false

# Default value for :format is :pretty
set :format, :pretty

# Update method : clone the entire repository
# Faster method : remote_cache but required further authentification
set :deploy_via, :remote_cache

# SSH options : use an "agent forwarding" to connect to the remote repository
set :ssh_options, forward_agent: true, port: ENV['GIT_REPO_PORT']

# Specify how many releases Capistrano should store on your server
set :keep_releases, 5

# Ensure any needed password prompts from SSH show up in your terminal so you can handle them
# But there is a bug when it set to true with sidekiq
set :pty, false

# Default value for :log_level is :debug
set :log_level, :debug

# files we want symlinking to specific entries in shared.
set :linked_files, %w[config/application.yml]

# dirs we want symlinking to shared
set :linked_dirs, %w[db/dump log public/prerender_cache public/uploads public/system tmp/pids tmp/cache tmp/sockets vendor/bundle]

# Compile assets
set :assets_roles, [:app]

# Bundle properties: Parallelize the installation of gems
set :bundle_binstubs, -> { shared_path.join('vendor/bundle/bin') }
set :bundle_path, -> { shared_path.join('vendor/bundle') }
set :bundle_jobs, 4

# Passenger config
set :passenger_roles, :app
set :passenger_restart_with_sudo, true

# Sidekiq configuration from file
set :sidekiq_config, -> { File.join(shared_path, 'config', 'sidekiq.yml') }

# Cron tasks
set :whenever_identifier, -> { "#{fetch(:application)}_#{fetch(:stage)}" }

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
  desc 'Install NPM packages'
  task :install do
    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :yarn, :install, '--production'
        end
      end
    end
  end

  desc 'Generate translation files'
  task :translation_files do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'i18n:js:export'
        end
      end
    end
  end

  desc 'Publish assets'
  task :production do
    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :npm, :run, 'production'
        end
      end
    end
  end

  after 'deploy:updated', 'assets:install'
  after 'deploy:updated', 'assets:translation_files'
  after 'deploy:updated', 'assets:production'
end

namespace :deploy do
  desc 'Add version application file'
  task :update_revision_file do
    on roles(:production), in: :sequence, wait: 5 do
      within release_path do
        git_revision = `git describe --abbrev=0 --tags`.chomp
        execute :echo, "REVISION='\"#{git_revision}\"' > config/initializers/revision.rb"
      end
    end
  end

  desc 'Restart web application'
  task :restart_web do
    on roles(:web), in: :sequence, wait: 5 do
      execute :sudo, 'service inrailsweblog-puma restart'
    end
  end

  desc 'Restart sidekiq application'
  task :restart_sidekiq do
    on roles(:web), in: :sequence, wait: 5 do
      execute :sudo, 'service inrailsweblog-sidekiq restart'
    end
  end

  desc 'Index elastic search'
  task :elastic_search do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'searchkick:reindex:all'
        end
      end
    end
  end

  desc 'Regenerate sitemap file'
  task :generate_sitemap do
    on roles(:production), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: 'production' do
          execute :rake, 'InRailsWeBlog:generate_sitemap'
        end
      end
    end
  end

  after :finishing, :update_revision_file
  after :finishing, :restart_web
  after :finishing, :restart_sidekiq
  after :publishing, :elastic_search
  after :publishing, :update_revision_file
  after :publishing, :generate_sitemap

  after :finishing, :cleanup
end

# Commands:
# cap production deploy
