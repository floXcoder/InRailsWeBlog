namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:create_version
  ## rails InRailsWeBlog:create_version COMMENT='Comment associated to the version'
  desc 'Create new version using Gitflow'
  task :deploy do |_task, _args|
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
  end

end
