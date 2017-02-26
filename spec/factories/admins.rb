FactoryGirl.define do

  factory :admin do
    sequence(:pseudo)     { |n| "Admin #{n+1}" }
    sequence(:email)      { |n| "admin_#{n+1}@example.com"}
    additional_info       'Personal information'
    locale                'fr'
    settings           { {} }
    password              'password'
    password_confirmation 'password'

    after(:build) { |admin| admin.class.skip_callback(:create, :after, :create_blog, raise: false) }

    trait :with_blog do
      after(:create) { |admin| admin.send(:create_blog) }
    end
  end

end
