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
    users = FactoryGirl.create_list(:user, 20, :confirmed,
                                  locale: 'fr',
                                  first_name: Faker::Name.first_name,
                                  last_name: Faker::Name.last_name,
                                  age: Random.rand(20..80),
                                  additional_info: Faker::Lorem.paragraph,
                                  city: Faker::Address.city,
                                  phone_number: Faker::PhoneNumber.phone_number)

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

  def self.create_dummy_articles(users)
    articles = []

    return articles
  end

end


