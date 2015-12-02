require 'populate/populate'

namespace :InRailsWeBlog do

  desc 'Reset and migrate the database the database, initialize with the seed data and reindex models for search'
  task :populate, [:reset, :data] => :environment do |t, args|

    %x{spring stop} if Rails.env.development?

    if args.reset
      # Recreate table
      Rake.application.invoke_task('db:migrate:reset')

      # Create Admin
      Populate::create_admin
    end

    unless Rails.env.production?
      # Populate database
      if args.data
        # Create users
        Populate::create_dummy_users

        # Select users
        admin = User.first
        users = User.all.offset(1)

        # Create tags
        tags = Populate::create_dummy_tags(admin)

        # Create articles with tags
        articles = Populate::create_dummy_articles_for(admin, tags)
        articles += Populate::create_dummy_articles_for(users, tags)

        # Create tag relationships
        Populate::create_tag_relationships_for(articles)
      end
    end

    # Reindex for ElasticSearch
    %x{rake searchkick:reindex CLASS=Article}
  end

end
