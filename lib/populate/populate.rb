require 'factory_girl_rails'
require 'faker'

Faker::Config.locale = 'fr'

class Populate

  def self.create_admin
    FactoryGirl.create(:user, :confirmed,
                       pseudo: 'Admin',
                       email: 'admin@inrailsweblog.com',
                       admin: true,
                       password: 'admin4blog',
                       password_confirmation: 'admin4blog')
  end

  def self.create_dummy_users
    users = FactoryGirl.create_list(:user, 20, :confirmed, :faker)

    return users
  end

  def self.create_dummy_groups(users)
    groups = Array.new(30)

    FactoryGirl.create_list(:group, 10, captain: users.sample)

    # teammates = users[200..210]
    # teammates.each { |teammate| groups[0..9].each { |group| group.add_teammate(teammate) } }
    # teammates = users[220..230]
    # teammates.each { |teammate| groups[10..19].each { |group| group.add_teammate(teammate) } }
    # teammates = users[240..250]
    # teammates.each { |teammate| groups[20..29].each { |group| group.add_teammate(teammate) } }

    return groups
  end

  def self.create_dummy_tags(user)
    # tags = FactoryGirl.create_list(:tag, 20, tagger: user)

    tag_name = []
    while tag_name.size < 30
      tag_name << [Faker::Hacker.adjective, Faker::Hacker.verb, Faker::Hacker.noun].sample
      tag_name.uniq!
    end

    tags = 30.times.map { |n|
      FactoryGirl.create(:tag,
                         tagger: user,
                         name: tag_name[n]
      )
    }

    return tags
  end

  def self.create_dummy_articles_for(users, tags)
    articles = []

    if users.is_a?(User)
      30.times.map {
        articles << FactoryGirl.create(:article,
                                       :with_tag,
                                       author: users,
                                       tags: tags.sample(rand(1..3)),
                                       visibility: Article.visibilities.keys.sample
        )
      }
    elsif users.is_a?(Array)
      users.each do |user|
        rand(10..20).times.map {
          articles << FactoryGirl.create(:article,
                                         :with_tag,
                                         author: user,
                                         tags: tags.sample(rand(1..3)),
                                         visibility: Article.visibilities.keys.sample
          )
        }
      end
    end

    return articles.flatten
  end

  def self.create_tag_relationships_for(articles)
    articles.sample(120).each do |article|
      tagged_articles = article.tags

      if tagged_articles.length > 2
        parent_tag = tagged_articles.first
        child_tag = tagged_articles.last

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


