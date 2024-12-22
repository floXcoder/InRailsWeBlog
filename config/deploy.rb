# frozen_string_literal: true

# lock '3.18.0'

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
set :pty, false

# Default value for :log_level is :debug
set :log_level, :debug

# files we want symlinking to specific entries in shared.
set :linked_files, %w[config/application.yml config/master.key public/service-worker.js]

# dirs we want symlinking to share
set :linked_dirs, %w[lib/geocoding/ip_db lib/tracking log node_modules public/assets public/seo_cache public/sitemaps public/uploads tmp/pids tmp/cache tmp/sockets vendor/bundle]

# Compile assets
set :assets_roles, [:app]

# Bundle properties: Parallelize the installation of gems
set :bundle_env_variables, -> { {
  BUNDLE_PATH: shared_path.join('vendor/bundle'),
  BUNDLE_BIN:  shared_path.join('vendor/bundle/bin')
} }
set :bundle_binstubs, nil
set :bundle_path, nil
set :bundle_jobs, 4

# Cron tasks
set :whenever_identifier, -> { "#{fetch(:application)}_#{fetch(:stage)}" }

namespace :assets do
  desc 'Install NPM packages'
  task :install do
    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :yarn, 'workspaces focus --production'
        end
      end
    end
  end

  desc 'Publish assets'
  task :generate do
    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :npm, :run, 'production'
        end
      end
    end
  end

  desc 'Generate translation files'
  task :translations do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        with fetch(:bundle_env_variables) do
          execute :bundle, :exec, 'i18n', 'export'
        end
      end
    end
  end

  after 'deploy:updated', 'assets:install'
  after 'deploy:updated', 'assets:generate'
  after 'deploy:updated', 'assets:translations'
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

  desc 'Reload web application'
  task :restart_web do
    on roles(:web), in: :sequence, wait: 5 do
      execute :sudo, 'service ginkonote-puma reload'
    end
  end

  desc 'Restart GoodJob application'
  task :restart_jobs do
    on roles(:web), in: :sequence, wait: 5 do
      execute :sudo, 'service ginkonote-jobs restart'
    end
  end

  # desc 'Index elastic search'
  # task :elastic_search do
  #   on roles(:app), in: :sequence, wait: 5 do
  #     within release_path do
  #       with rails_env: fetch(:rails_env) do
  #         execute :rake, 'InRailsWeBlog:search_reindex'
  #       end
  #     end
  #   end
  # end

  # desc 'Regenerate sitemap file'
  # task :generate_sitemap do
  #   on roles(:production), in: :sequence, wait: 5 do
  #     within release_path do
  #       with rails_env: 'production' do
  #         execute :rake, 'InRailsWeBlog:generate_sitemap'
  #       end
  #     end
  #   end
  # end

  after :finishing, :update_revision_file
  after :finishing, :restart_web
  after :finishing, :restart_jobs
  # after :publishing, :elastic_search
  # after :publishing, :generate_sitemap

  after :finishing, :cleanup
end

# Commands:
# cap production deploy
