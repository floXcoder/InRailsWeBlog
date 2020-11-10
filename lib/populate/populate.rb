# frozen_string_literal: true

require 'factory_bot_rails'
require 'faker'

Faker::Config.locale = 'fr'

class Populate

  def self.create_admin
    FactoryBot.create(:admin,
                      # :with_blog,
                      pseudo:                ENV['WEBSITE_ADMIN_NAME'],
                      email:                 ENV['WEBSITE_ADMIN_EMAIL'],
                      locale:                'fr',
                      additional_info:       'Administrator',
                      password:              ENV['WEBSITE_ADMIN_PASSWORD'],
                      password_confirmation: ENV['WEBSITE_ADMIN_PASSWORD'])
  end

  def self.create_main_user
    FactoryBot.create(:user,
                      pseudo:                ENV['WEBSITE_NAME'],
                      email:                 ENV['WEBSITE_EMAIL'],
                      locale:                'fr',
                      additional_info:       'Utilisateur principal',
                      city:                  'Paris',
                      country:               'France',
                      password:              ENV['WEBSITE_PASSWORD'],
                      password_confirmation: ENV['WEBSITE_PASSWORD'])
  end

  def self.create_dummy_users(user_number)
    users = []

    User.transaction do
      user_number.times do
        users << FactoryBot.create(:user,
                                   locale:          'fr',
                                   first_name:      Faker::Name.first_name,
                                   last_name:       Faker::Name.last_name,
                                   additional_info: Faker::Lorem.paragraph,
                                   city:            Faker::Address.city,
                                   phone_number:    Faker::PhoneNumber.phone_number)
      end
    end

    return users
  end

  # def self.add_profile_picture_to(users, user_number = 1)
  #   users = [users] if users.is_a?(User)
  #
  #   User.transaction do
  #     users.sample(user_number).each do |user|
  #       user.create_picture(user: user, remote_image_url: Faker::Avatar.image(nil, '50x50'))
  #     end
  #   end
  # end

  def self.create_dummy_topics_for(users, topic_number_per_user)
    users = [users] if users.is_a?(User)

    topics = []
    Topic.transaction do
      users.each do |user|
        topics_name = []
        while topics_name.size < topic_number_per_user * users.count
          topics_name << [Faker::Ancient.god, Faker::App.name, Faker::Book.title, Faker::Cat.name, Faker::Company.name, Faker::Dessert.variety, Faker::Food.dish, Faker::Hipster.word, Faker::Lorem.word, Faker::Team.creature].sample
          topics_name.uniq!
        end

        topics << Array.new(topic_number_per_user) do |n|
          FactoryBot.create(:topic,
                            user:       user,
                            visibility: rand(0..1),
                            name:       topics_name[n].mb_chars.capitalize.to_s)
        end
      end
    end

    return topics.flatten
  end

  def self.create_dummy_tags_for(users, tags_number_per_user, options = {})
    users = [users] if users.is_a?(User)

    tags_name = []
    while tags_name.size < tags_number_per_user * users.count + 1
      tags_name << [Faker::Hacker.adjective, Faker::Hacker.verb, Faker::Hacker.noun, Faker::Hacker.abbreviation, Faker::Hacker.verb, Faker::StarWars.character, Faker::Superhero.name, Faker::Team.name].sample.capitalize
      tags_name -= options[:exclude_tag_names] if options[:exclude_tag_names]
      tags_name.uniq!
    end

    tags      = []
    tag_index = 0
    Tag.transaction do
      users.each do |user|
        tags << Array.new(tags_number_per_user) do |_n|
          tag_index += 1
          FactoryBot.create(:tag,
                            user:       user,
                            visibility: options[:visibility] || rand(0..1),
                            name:       tags_name[tag_index].mb_chars.capitalize.to_s)
        end
      end
    end

    return tags.flatten
  end

  def self.create_dummy_stories_and_notes_for(users, tags, articles_by_users_and_topics)
    users = [users] if users.is_a?(User)

    articles = []

    users.each do |user|
      articles_number = if articles_by_users_and_topics.is_a?(Range)
                          rand(articles_by_users_and_topics)
                        else
                          articles_by_users_and_topics
                        end
      articles        = Array.new(articles_number) do |n|
        Topic.where(user_id: user.id).map do |topic|
          permitted_tags = tags.select { |tag| tag.everyone? || (tag.only_me? && tag.user_id == user.id) }

          if (n % 2).zero?
            parent_tags = permitted_tags.sample(rand(1..2))
            child_tags  = permitted_tags.sample(rand(1..2))
            FactoryBot.create(:article,
                              user:        user,
                              topic:       topic,
                              mode:        'note',
                              title:       nil,
                              visibility:  Article.visibilities.keys.sample,
                              parent_tags: parent_tags,
                              child_tags:  child_tags - parent_tags)
          else
            FactoryBot.create(:article,
                              user:       user,
                              topic:      topic,
                              mode:       'story',
                              visibility: Article.visibilities.keys.sample,
                              tags:       permitted_tags.sample(rand(1..3)))
          end
        end
      end
    end

    return articles.flatten
  end

  def self.create_dummy_links_for(users, tags, articles_by_users_and_topics)
    users = [users] if users.is_a?(User)

    links = []

    users.each do |user|
      links_number = if articles_by_users_and_topics.is_a?(Range)
                       rand(articles_by_users_and_topics)
                     else
                       articles_by_users_and_topics
                     end
      links        = Array.new(links_number) do
        Topic.where(user_id: user.id).map do |topic|
          permitted_tags = tags.select { |tag| tag.everyone? || (tag.only_me? && tag.user_id == user.id) }

          FactoryBot.create(:article,
                            user:       user,
                            topic:      topic,
                            mode:       'link',
                            title:      nil,
                            reference:  Faker::Internet.url,
                            visibility: Article.visibilities.keys.sample,
                            tags:       permitted_tags.sample(rand(1..3)))
        end
      end
    end

    return links.flatten
  end

  def self.create_article_relationships_for(articles, user, relationship_number)
    article_relationships = []
    ArticleRelationship.transaction do
      articles.sample(relationship_number).each do |article|
        article_relationships << FactoryBot.create(:article_relationship,
                                                   user:   user,
                                                   parent: article,
                                                   child:  articles.sample)
      end
    end

    return article_relationships
  end

  def self.create_comments_for(articles, users, comment_number)
    users = [users] if users.is_a?(User)

    Comment.transaction do
      articles.each do |article|
        next if article.only_me?

        previous_comment = nil
        comments_number  = comment_number
        comments_number  = rand(comment_number) if comment_number.is_a?(Range)
        rand(comments_number).times.each do |i|
          if (i % 5).zero?
            if previous_comment
              child_comment = Comment.build_from(article, users.sample.id, Faker::Hipster.paragraph(2, true, 1))
              child_comment.save
              child_comment.move_to_child_of(previous_comment)
            end
          else
            parent_comment = Comment.build_from(article, users.sample.id, Faker::Hipster.paragraph(2, true, 3))
            parent_comment.save
            previous_comment = parent_comment
          end
        end
      end
    end
  end

  def self.create_bookmarks_for(articles, users, bookmark_number)
    users = [users] if users.is_a?(User)

    Article.transaction do
      users.each do |user|
        articles.sample(rand(bookmark_number)).each do |article|
          bookmark = user.bookmarks.build
          bookmark.add(user, 'Article', article.id)
        end
      end
    end
  end

  def self.add_votes_for(articles, users, voted_articles)
    users = [users] if users.is_a?(User)

    Bookmark.transaction do
      users.each do |user|
        articles.sample(rand(voted_articles)).each do |article|
          if rand(1..3) > 1
            user.vote_for(article)
          else
            user.vote_against(article)
          end
        end
      end
    end
  end

  def self.marked_as_outdated_for(articles, users, outdated_articles)
    users = [users] if users.is_a?(User)

    Article.transaction do
      users.each do |user|
        articles.sample(rand(outdated_articles)).each do |article|
          article.mark_as_outdated(user)
        end
      end
    end
  end

  def self.create_activities_for_articles
    Tracker.transaction do
      Article.all.each do |article|
        article.tracker.queries_count  = rand(1..100)
        article.tracker.searches_count = rand(1..20)
        article.tracker.visits_count   = rand(1..30)
        article.tracker.clicks_count   = rand(1..60)
        article.tracker.views_count    = rand(1..200)
        article.tracker.save
      end
    end
  end

  def self.create_activities_for_users
    Tracker.transaction do
      User.all.each do |user|
        user.tracker.queries_count = rand(1..100)
        user.tracker.visits_count  = rand(1..30)
        user.tracker.clicks_count  = rand(1..60)
        user.tracker.views_count   = rand(1..200)
        user.tracker.save
      end
    end
  end

  def self.create_activities_for_tags
    Tracker.transaction do
      Tag.all.each do |tag|
        tag.tracker.queries_count = rand(1..100)
        tag.tracker.visits_count  = rand(1..30)
        tag.tracker.clicks_count  = rand(1..60)
        tag.tracker.views_count   = rand(1..200)
        tag.tracker.save
      end
    end
  end

end
