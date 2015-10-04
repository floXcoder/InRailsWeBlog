require 'populate/populate'

namespace :InRailsWeBlog do

  desc 'Reset the database, migrate the database, initialize with the seed data and reindex models for search'
  task :populate, [:reset] => :environment do |t, args|

    unless Rails.env.production?
      %x{spring stop} if Rails.env.development?

      # Reset Database
      if args.reset
        # Recreate table
        Rake.application.invoke_task('db:migrate:reset')

        # Create users
        admin = Populate::create_admin
        users = Populate::create_dummy_users
      end

      # Create content
      admin ||= User.first
      users ||= User.all.offset(1)
      Populate::create_dummy_articles(users)

      # Reindex for ElasticSearch
      # %x{rake searchkick:reindex CLASS=Article}
    end
  end

end
