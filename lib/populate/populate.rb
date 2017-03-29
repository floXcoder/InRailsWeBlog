require 'factory_girl_rails'
require 'faker'

Faker::Config.locale = 'fr'

class Populate

  def self.create_admin
    FactoryGirl.create(:admin,
                       # :with_blog,
                       pseudo:                ENV['WEBSITE_ADMIN_NAME'],
                       email:                 ENV['WEBSITE_ADMIN_EMAIL'],
                       locale:                'fr',
                       additional_info:       'Administrator',
                       password:              ENV['WEBSITE_ADMIN_PASSWORD'],
                       password_confirmation: ENV['WEBSITE_ADMIN_PASSWORD'])
  end

  def self.create_main_user
    FactoryGirl.create(:user,
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
        users << FactoryGirl.create(:user,
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

  def self.add_profile_picture_to(users, user_number = 1)
    users = [users] if users.is_a?(User)

    User.transaction do
      users.sample(user_number).each do |user|
        user.create_picture(user: user, remote_image_url: Faker::Avatar.image(nil, '50x50'))
      end
    end
  end

  def self.create_dummy_tags(user, tag_number)
    tags_name = []

    while tags_name.size < tag_number
      tags_name << [Faker::Hacker.adjective, Faker::Hacker.verb, Faker::Hacker.noun].sample
      tags_name.uniq!
    end

    tags = Array.new(tag_number) do |n|
      FactoryGirl.create(:tag,
                         user:       user,
                         visibility: rand(0..1),
                         name:       tags_name[n].mb_chars.capitalize.to_s)
    end

    return tags
  end

  def self.create_dummy_articles_for(users, tags, articles_by_users)
    articles = []
    users    = [users] if users.is_a?(User)

    users.each do |user|
      articles_number = articles_by_users
      articles_number = rand(articles_number) if articles_by_users.is_a?(Range)
      Array.new(articles_number) do
        articles << FactoryGirl.create(:article_with_tags,
                                       user:       user,
                                       topic:      Topic.find_by_id(user.current_topic_id),
                                       tags:       tags.sample(rand(1..3)),
                                       visibility: Article.visibilities.keys.sample)
      end
    end

    return articles.flatten
  end

  def self.create_tag_relationships_for(articles)
    Article.transaction do
      articles.each do |article|
        tags = article.tags

        if tags.length > 2
          parent_tag = tags.first
          child_tag  = tags.last

          article.tagged_articles.find_by(tag_id: parent_tag.id).update(parent: true)
          article.tagged_articles.find_by(tag_id: child_tag.id).update(child: true)

          # if parent_tag.children.exists?(child_tag.id)
          #   previous_article_ids = parent_tag.parent_relationship.find_by(child_id: child_tag.id).article_ids
          #   parent_tag.parent_relationship.find_by(child_id: child_tag.id).update_attribute(:article_ids, previous_article_ids + [article.id])
          # else
          #   parent_tag.parent_relationship.build(child_id: child_tag.id, article_ids: [article.id])
          # end
          parent_tag.save
        end
      end
    end
  end

  def self.create_comments_for(articles, users, comment_number)
    users = [users] if users.is_a?(User)

    Comment.transaction do
      articles.each do |article|
        previous_comment = nil
        comments_number  = comment_number
        comments_number  = rand(comment_number) if comment_number.is_a?(Range)
        rand(comments_number).times.each do |i|
          if i % 5 == 0
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
        tag.tracker.clicks_count  = rand(1..60)
        tag.tracker.views_count   = rand(1..200)
        tag.tracker.save
      end
    end
  end

end


