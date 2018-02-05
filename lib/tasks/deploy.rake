namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:deploy
  ## rails InRailsWeBlog:deploy COMMENT='Comment...'
  ## rails InRailsWeBlog:deploy NO_TEST=true  # To skip tests
  desc 'Deploy project to server (repo must be on develop branch). Ex: rake InRailsWeBlog:deploy EVOL=#350,#360'
  task :deploy do |_task, _args|
    # Check for uncommitted files
    fail 'Files not committed in repo, run git status' if %x(git diff --exit-code) != ''

    # Check current branch is develop
    fail 'Current branch is not develop' if %x(git name-rev --name-only HEAD).strip != 'develop'

    # Run tests: rspec and karma
    unless ENV['NO_TEST']
      begin
        Rails.env = 'test'
        require 'rspec/core/rake_task'
        RSpec::Core::RakeTask.new(:spec) do |spec_task|
          spec_task.pattern    = Dir.glob('spec/**/*_spec.rb')
          spec_task.rspec_opts = ' --require rails_helper --tag basic'
        end
        Rake.application.invoke_task('spec')

          # No JS tests for the moment
          # system('./node_modules/karma/bin/karma start ./frontend/test/karma.conf.js --single-run', out: $stdout, err: :out)
      rescue StandardError => error
        if error
          puts 'Error in tests. Do you want to continue ? (y or n)'
          answer = STDIN.gets.chomp
          if answer != 'y'
            fail 'Errors when testing application'
          end
        end
      end
    end

    # Synchronize local and origin
    %x(git push -u origin develop)
    %x(git push -u origin master)
    %x(git push --tags)
    # Fetch tags
    %x(git fetch --tags)
    # Get last tag of master
    last_master_tag = %x(git describe --abbrev=0 --tags origin/master).strip
    # Increment tag
    major_version, minor_version, patch_version = last_master_tag.split('.')
    fail "Last Git tag is not a numeric version: #{last_master_tag}" unless major_version =~ /^[0-9]+$/ || minor_version =~ /^[0-9]+$/
    patch_version  = patch_version ? patch_version.to_i + 1 : 1
    new_master_tag = "#{major_version}.#{minor_version}.#{patch_version}"

    # Create new release with new tag
    %x(git flow release start #{new_master_tag})
    # Finish release
    finish_tag = ENV['COMMENT'] ? "#{new_master_tag} : #{ENV['COMMENT']}" : new_master_tag
    %x(git flow release finish -m '#{finish_tag}' #{new_master_tag})
    # Push branches and tags
    %x(git push -u origin master)
    %x(git push -u origin develop)

    # Deploy with capistrano
    system('cap production deploy', out: $stdout, err: :out)

    # Reindex Elastic Search
    system('cap production deploy:elastic_search', out: $stdout, err: :out)
  end

end
