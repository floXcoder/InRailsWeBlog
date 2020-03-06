# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:deploy
  ## rails InRailsWeBlog:deploy SKIP_CI=true
  ## rails InRailsWeBlog:deploy TAG=1.0.0
  desc 'Deploy project to server (repo must be on develop branch)'
  task :deploy do |_task, _args|
    # Check for uncommitted files
    fail 'Files not committed in repo, run git status' if %x(git diff --exit-code) != ''

    # Check current branch is develop
    fail 'Current branch is not develop' if %x(git name-rev --name-only HEAD).strip != 'develop'

    if ENV['SKIP_CI']
      # Deploy with capistrano from develop branch
      system('cap production deploy', out: $stdout, err: :out)
    else
      # Create new tag on master (it will automatically run tests and deploy through Gitlab)
      Rake.application.invoke_task('InRailsWeBlog:create_version')
    end
  end

end
