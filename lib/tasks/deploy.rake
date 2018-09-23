# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:deploy
  ## rails InRailsWeBlog:deploy CAP=true
  desc 'Deploy project to server (repo must be on develop branch)'
  task :deploy do |_task, _args|
    # Check for uncommitted files
    fail 'Files not committed in repo, run git status' if %x(git diff --exit-code) != ''

    # Check current branch is develop
    fail 'Current branch is not develop' if %x(git name-rev --name-only HEAD).strip != 'develop'

    # Create new tag on master (it will automatically run tests and deploy through Gitlab)
    Rake.application.invoke_task('InRailsWeBlog:create_version')

    # Deploy with capistrano
    system('cap production deploy', out: $stdout, err: :out) if ENV['CAP']
  end

end
