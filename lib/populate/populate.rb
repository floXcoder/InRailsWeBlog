require 'factory_girl_rails'
require 'faker'

Faker::Config.locale = 'fr'

class Populate

  def self.create_admin
    FactoryGirl.create(:user, :confirmed,
                       pseudo: 'Admin',
                       email: 'blog@l-x.fr',
                       password: 'flofloflo',
                       password_confirmation: 'flofloflo')
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
    tags = FactoryGirl.create_list(:tag, 10, tagger: user)

    return tags
  end

  def self.create_dummy_articles_for(users, tags)
    articles =
        if users.is_a?(User)
          30.times.map {
            FactoryGirl.create(:article,
                               :with_tag,
                               author: users,
                               tags: tags.sample(rand(1..3)),
                               visibility: Article.visibilities.keys.sample
            )
          }
        elsif users.is_a?(Array)
          users.each do |user|
            rand(10..20).times.map {
              FactoryGirl.create(:article,
                                 :with_tag,
                                 author: user,
                                 tags: tags.sample(rand(1..3)),
                                 visibility: Article.visibilities.keys.sample
              )
            }
          end
        end

    return articles
  end

end


