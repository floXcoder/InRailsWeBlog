require 'populate/populate'

namespace :InRailsWeBlog do

  # rake InRailsWeBlog:populate[reset,data]
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
        Populate::create_dummy_users(30)

        # Select users
        admin = User.first
        users = User.all.offset(1)

        # Create tags
        tags = Populate::create_dummy_tags(admin, 20)

        # Create articles with tags
        articles = Populate::create_dummy_articles_for(admin, tags, 20)
        articles += Populate::create_dummy_articles_for(users, tags, 5..15)

        # Create tag relationships
        Populate::create_tag_relationships_for(articles.sample(120))

        # Create comments for articles
        Populate::create_comments_for(articles, admin, 1..10)
        Populate::create_comments_for(articles, users, 1..15)

        # Create bookmarks for articles
        Populate::create_bookmarks_for(articles, admin, 1..10)
        Populate::create_bookmarks_for(articles, users, 1..10)

        # Create activities for article, users and tags
        Populate::create_activities_for_articles(articles)
        Populate::create_activities_for_users(users)
        Populate::create_activities_for_tags(tags)
      end
    end

    # Reindex for ElasticSearch
    %x{rake searchkick:reindex CLASS=Article}
  end

end
