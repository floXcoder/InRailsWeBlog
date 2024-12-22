# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:deploy
  ## rails InRailsWeBlog:deploy SKIP_CI=true
  ## rails InRailsWeBlog:deploy TAG=1.0.0
  desc 'Deploy project to server (repo must be on develop branch)'
  task :deploy, [] => :environment do |_task, _args|
    # Check for uncommitted files
    fail 'Files not committed in repo, run git status' if %x(git diff --exit-code) != ''

    # Check current branch is "develop"
    fail 'Current branch is not develop' if %x(git rev-parse --abbrev-ref HEAD).strip != 'develop'

    if ENV['SKIP_CI']
      # Deploy with capistrano from last commit of "develop" branch
      system('cap production deploy', out: $stdout, err: :out)
    else
      # Merge to "master" branch and a new tag (it will automatically run tests and deploy through Gitlab, Branch pipeline or Tag pipeline)

      # Push dev first for CI
      %x(git push -u origin develop)

      # Fetch tags
      %x(git fetch --tags)

      # Get last tag and increment it
      if ENV['TAG'].present?
        # Get from environment the tag
        new_master_tag = ENV['TAG']
      else
        # Get last tag of "master"
        last_master_tag = %x(git describe --abbrev=0 --tags origin/master).strip
        # Increment tag
        major_version, minor_version, patch_version = last_master_tag.split('.')

        fail "Last Git tag is not a numeric version: #{last_master_tag}" unless major_version =~ /^[0-9]+$/ || minor_version =~ /^[0-9]+$/

        patch_version  = patch_version ? patch_version.to_i + 1 : 1
        new_master_tag = "#{major_version}.#{minor_version}.#{patch_version}"
      end

      # Merge "develop" branch to "master" and apply tag
      %x(git checkout master)
      %x(git merge develop)
      %x(git tag #{new_master_tag})

      # Push "master" and tags (automatic deploy on commit change)
      %x(git push -u origin master)
      %x(git push --tags)

      # Ensure current branch is "develop"
      %x(git checkout develop)
    end
  end

end
