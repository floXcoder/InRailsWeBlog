# encoding: UTF-8
namespace :InRailsWeBlog do

  # Usage :
  ## WARNING : Use \, to type comma and not just ',' (but just ':' is ok)
  ### rake InRailsWeBlog:deploy['0.1','0.1 : Comment of my new version']
  ### rake InRailsWeBlog:deploy['0.1','Comment of my new version','reset_db']
  desc 'Full Deployment: create release, push to server and deploy with capistrano'
  task :deploy, [:version, :comment, :reset_db] => :environment do |t, args|
    version = args[:version]
    comment = args[:comment]
    reset_db = args[:reset_db]

    fail 'Version and comment must be specified' if version.blank? || comment.blank?

    # ### Release
    # # Create release
    # %x{git flow release start #{version}}
    # # Publish release
    # %x{git flow release finish -m #{comment} #{version}}

    ### Push to server
    %x{git push -u origin develop}
    %x{git push -u origin master}
    %x{git push --tags}

    # ### Call capistrano to deploy to server
    # %x{cap production deploy}
    # if reset_db == 'reset_db'
    #   %x{cap production deploy:reset_database}
    # end

  end
end
