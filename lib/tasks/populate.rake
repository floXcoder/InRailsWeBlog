require 'populate/populate'

namespace :InRailsWeBlog do

  # rake InRailsWeBlog:populate[reset,data]
  desc 'Reset and migrate the database the database, initialize with the seed data and reindex models for search'
  task :populate, [:reset, :data] => :environment do |t, args|

    %x{spring stop} if Rails.env.development?

    if args.reset
      # Recreate table
      Rake.application.invoke_task('db:migrate:reset')

      # Remove upload directory
      upload_dir = Rails.root.join('public', 'uploads')
      FileUtils.rm_rf(Dir.glob(upload_dir.to_s + '/*'))

      # Create Admin
      Populate::create_admin

      # Create Main User
      Populate::create_main_user
    end

    unless Rails.env.production?
      # Populate database
      if args.data
        # Create users
        Populate::create_dummy_users(10)

        # Select users
        admin     = User.first
        main_user = User.second
        users     = User.all.offset(2)

        # Add profile image to users
        # Populate::add_profile_picture_to(admin)
        # Populate::add_profile_picture_to(main_user)
        # Populate::add_profile_picture_to(users, 15)

        # Create tags
        tags     = Populate::create_dummy_tags(main_user, 20)

        # Create articles with tags
        articles = Populate::create_dummy_articles_for(main_user, tags, 20)
        articles += Populate::create_dummy_articles_for(users, tags, 5..15)

        # Create tag relationships
        Populate::create_tag_relationships_for(articles.sample(120))

        # Associate tags to user current topic
        Populate::create_tag_to_topics_for(Tag.all)

        # Create comments for articles
        Populate::create_comments_for(articles, main_user, 1..10)
        Populate::create_comments_for(articles, users, 1..15)

        # Create bookmarks for articles
        Populate::create_bookmarks_for(articles, main_user, 1..10)
        Populate::create_bookmarks_for(articles, users, 1..10)

        # Add votes for articles
        Populate::add_votes_for(articles, main_user, 5..15)
        Populate::add_votes_for(articles, users, 5..15)

        # Marked as outdated for articles
        Populate::marked_as_outdated_for(articles, main_user, 1..3)
        Populate::marked_as_outdated_for(articles, users, 1..3)

        # Create activities for article, users and tags
        Populate::create_activities_for_articles
        Populate::create_activities_for_users
        Populate::create_activities_for_tags
      end
    end

    # Reindex for ElasticSearch
    Rake::Task['searchkick:reindex:all'].invoke
  end

end
