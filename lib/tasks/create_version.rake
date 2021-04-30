# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:create_version
  ## rails InRailsWeBlog:create_version COMMENT='Comment for this version'
  desc 'Create new version using Gitflow'
  task :create_version, [] => :environment do |_task, _args|
    # Push dev first for CI
    %x(git push -u origin develop)

    # Fetch tags
    %x(git fetch --tags)

    if ENV['TAG'].present?
      # Get from environment the tag
      new_master_tag = ENV['TAG']
    else
      # Get last tag of master
      last_master_tag = %x(git describe --abbrev=0 --tags origin/master).strip
      # Increment tag
      major_version, minor_version, patch_version = last_master_tag.split('.')

      fail "Last Git tag is not a numeric version: #{last_master_tag}" unless major_version =~ /^[0-9]+$/ || minor_version =~ /^[0-9]+$/

      patch_version  = patch_version ? patch_version.to_i + 1 : 1
      new_master_tag = "#{major_version}.#{minor_version}.#{patch_version}"
    end

    # Create new release with new tag
    %x(git flow release start #{new_master_tag})
    # Finish release
    finish_tag = ENV['COMMENT'] ? "#{new_master_tag} : #{ENV['COMMENT']}" : new_master_tag
    %x(git flow release finish -m '#{finish_tag}' #{new_master_tag})

    # Push master and tags (automatic deploy on tag change)
    %x(git push -u origin master)
    %x(git push --tags)
  end

end
