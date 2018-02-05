# frozen_string_literal: true

require 'populate/populate'

namespace :InRailsWeBlog do

  # rails InRailsWeBlog:populate[reset,data]
  desc 'Reset and migrate the database the database, initialize with the seed data and reindex models for search'
  task :populate, [:reset, :data] => :environment do |_, args|
    unless Rails.env.production?
      `spring stop` if Rails.env.development?

      if args.reset
        # Recreate table
        Rake.application.invoke_task('db:migrate:reset')

        # Remove upload directory
        upload_dir = Rails.root.join('public', 'uploads')
        FileUtils.rm_rf(Dir.glob(upload_dir.to_s + '/*'))

        # Create users
        admin     = Populate::create_admin
        main_user = Populate::create_main_user
      end

      if args.data
        admin     ||= Admin.first
        main_user ||= User.first

        # Create users
        other_users = Populate::create_dummy_users(10)
        # Populate::add_profile_picture_to(users, 5)

        # Create topics
        topics = Populate::create_dummy_topics_for([main_user, *other_users], 5)

        # Create common public tags
        common_tags = Populate::create_dummy_tags_for([main_user, *other_users], 5, visibility: 'everyone')
        # Create personal tags for each user
        personal_tags = Populate::create_dummy_tags_for([main_user, *other_users], 15, visibility: 'only_me', exclude_tag_names: common_tags.map(&:name))

        # Create articles with tags
        main_articles  = Populate::create_dummy_articles_for(main_user, common_tags + personal_tags, 40)
        other_articles = Populate::create_dummy_articles_for(other_users, common_tags + personal_tags, 5..15)
        main_links     = Populate::create_dummy_links_for(main_user, common_tags + personal_tags, 5..15)

        # Creation relationships between articles
        Populate::create_article_relationships_for(main_articles, main_user, 10)

        # Create comments for articles
        Populate::create_comments_for(main_articles, other_users, 1..15)
        Populate::create_comments_for(other_articles, main_user, 1..10)

        # Create bookmarks for articles
        Populate::create_bookmarks_for(main_articles, other_users, 1..10)
        Populate::create_bookmarks_for(other_articles, main_user, 1..10)

        # Add votes for articles
        Populate::add_votes_for(main_articles, other_users, 5..15)
        Populate::add_votes_for(other_articles, main_user, 5..15)

        # Marked as outdated for articles
        Populate::marked_as_outdated_for(main_articles, other_users, 1..3)
        Populate::marked_as_outdated_for(other_articles, main_user, 1..3)

        # Create activities for article, users and tags
        Populate::create_activities_for_articles
        Populate::create_activities_for_users
        Populate::create_activities_for_tags
      end

      # Reindex for ElasticSearch
      Rake::Task['searchkick:reindex:all'].invoke
    end
  end

end
