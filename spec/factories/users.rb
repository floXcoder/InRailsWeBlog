# frozen_string_literal: true
# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  street                 :string
#  city                   :string
#  postcode               :string
#  state                  :string
#  country                :string
#  mobile_number          :string
#  phone_number           :string
#  additional_info        :string
#  birth_date             :date
#  locale                 :string           default("fr")
#  settings               :jsonb            not null
#  allow_comment          :boolean          default(TRUE), not null
#  visibility             :integer          default("everyone"), not null
#  current_topic_id       :integer
#  pictures_count         :integer          default(0)
#  topics_count           :integer          default(0)
#  articles_count         :integer          default(0)
#  tags_count             :integer          default(0)
#  bookmarks_count        :integer          default(0)
#  comments_count         :integer          default(0)
#  slug                   :string
#  deleted_at             :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

FactoryBot.define do

  factory :user do
    sequence(:pseudo)     { |n| "Person #{n + 1}" }
    sequence(:email)      { |n| "person_#{n + 1}@example.com" }
    password              { 'password' }
    password_confirmation { 'password' }
    first_name            { 'First name' }
    last_name             { 'Last name' }
    street                { 'Street' }
    city                  { 'City' }
    postcode              { '33000' }
    state                 { 'Gironde' }
    country               { 'France' }
    additional_info       { 'Personal information' }
    birth_date            { Faker::Date.backward(days: 365) }
    locale                { 'fr' }
    mobile_number         { '0300000000' }
    phone_number          { '0600000000' }
    pictures_count        { 0 }
    # settings              { {} }
    # external              false
    visibility            { 'everyone' }

    trait :fake do
      first_name      { Faker::Name.first_name }
      last_name       { Faker::Name.last_name }
      additional_info { Faker::Lorem.paragraph }
      city            { Faker::Address.city }
    end

    transient do
      confirmation_email  { false }
      not_confirmed       { false }
    end

    after(:build) do |user, evaluator|
      unless evaluator.confirmation_email
        user.skip_confirmation_notification!
      end
    end

    after(:create) do |user, evaluator|
      unless evaluator.not_confirmed
        user.confirm
      end
    end
  end

end
