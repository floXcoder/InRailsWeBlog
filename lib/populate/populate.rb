require 'factory_girl_rails'
require 'faker'

Faker::Config.locale = 'fr'

class Populate

  def self.create_admin
    FactoryGirl.create(:user, :confirmed,
                       pseudo:                'Admin',
                       email:                 'admin@inrailsweblog.com',
                       admin:                 true,
                       locale:                'fr',
                       first_name:            'Admin',
                       last_name:             'Administrator',
                       additional_info:       'Administrator',
                       age:                   0,
                       city:                  '',
                       country:               'France',
                       password:              'admin4blog',
                       password_confirmation: 'admin4blog')
  end

  def self.create_dummy_users(user_number)
    users = FactoryGirl.create_list(:user, user_number, :confirmed, :faker)

    return users
  end

  def self.create_dummy_groups(users, group_number)
    # groups = Array.new(group_number)
    # FactoryGirl.create_list(:group, group_number, captain: users.sample)

    # teammates = users[200..210]
    # teammates.each { |teammate| groups[0..9].each { |group| group.add_teammate(teammate) } }
    # teammates = users[220..230]
    # teammates.each { |teammate| groups[10..19].each { |group| group.add_teammate(teammate) } }
    # teammates = users[240..250]
    # teammates.each { |teammate| groups[20..29].each { |group| group.add_teammate(teammate) } }

    # return groups
  end

  def self.create_dummy_tags(user, tag_number)
    tag_name = []
    while tag_name.size < tag_number
      tag_name << [Faker::Hacker.adjective, Faker::Hacker.verb, Faker::Hacker.noun].sample
      tag_name.uniq!
    end

    tags = tag_number.times.map { |n|
      FactoryGirl.create(:tag,
                         tagger: user,
                         name:   tag_name[n]
      )
    }

    return tags
  end

  def self.create_dummy_articles_for(users, tags, articles_by_user_number)
    articles = []
    users = [users] if users.is_a?(User)

    users.each do |user|
      articles_number = articles_by_user_number
      articles_number = rand(articles_number) if articles_by_user_number.is_a?(Range)
      articles_number.times.map {
        articles << FactoryGirl.create(:article,
                                       :with_tag,
                                       author:     user,
                                       tags:       tags.sample(rand(1..3)),
                                       visibility: Article.visibilities.keys.sample
        )
      }
    end

    return articles.flatten
  end

  def self.create_tag_relationships_for(articles)
    Article.transaction do
      articles.each do |article|
        tagged_articles = article.tags

        if tagged_articles.length > 2
          parent_tag = tagged_articles.first
          child_tag  = tagged_articles.last

          article.tagged_articles.find_by(tag_id: parent_tag.id).update(parent: true)
          article.tagged_articles.find_by(tag_id: child_tag.id).update(child: true)

          if parent_tag.children.exists?(child_tag.id)
            previous_article_ids = parent_tag.parent_relationship.find_by(child_id: child_tag.id).article_ids
            parent_tag.parent_relationship.find_by(child_id: child_tag.id).update_attribute(:article_ids, previous_article_ids + [article.id])
          else
            parent_tag.parent_relationship.build(child_id: child_tag.id, article_ids: [article.id])
          end
          parent_tag.save
        end
      end
    end
  end

  def self.create_comments_for(articles, users, comment_number)
    users = [users] if users.is_a?(User)

    Article.transaction do
      articles.each do |article|
        previous_comment = nil
        comments_number = comment_number
        comments_number = rand(comment_number) if comment_number.is_a?(Range)
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
          article.add_bookmark(user)
        end
      end
    end
  end

  def self.create_activities_for_articles(articles)
    Article.transaction do
      articles.each do |article|
        article.tracker.queries_count = rand(1..100)
        article.tracker.searches_count = rand(1..20)
        article.tracker.comments_count = article.comment_threads.count
        article.tracker.bookmarks_count = article.user_bookmarks.count
        article.tracker.clicks_count = rand(1..60)
        article.tracker.views_count = rand(1..200)
        article.save
      end
    end
  end

  def self.create_activities_for_users(users)
    User.transaction do
      users.each do |user|
        user.tracker.queries_count = rand(1..100)
        user.tracker.comments_count = user.comments.count
        user.tracker.bookmarks_count = user.bookmarks.count
        user.tracker.clicks_count = rand(1..60)
        user.tracker.views_count = rand(1..200)
        user.save
      end
    end
  end

  def self.create_activities_for_tags(tags)
    Tag.transaction do
      tags.each do |tag|
        tag.tracker.queries_count = rand(1..100)
        tag.tracker.clicks_count = rand(1..60)
        tag.tracker.views_count = rand(1..200)
        tag.save
      end
    end
  end

end


