namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:deploy
  ## rails InRailsWeBlog:deploy NO_TEST=true  # To skip tests
  desc 'Deploy project to server (repo must be on develop branch)'
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

    # Create new tag on master
    Rake.application.invoke_task('InRailsWeBlog:create_version')

    # Deploy with capistrano
    system('cap production deploy', out: $stdout, err: :out)
  end

end
