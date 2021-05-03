# frozen_string_literal: true

# == Schema Information
#
# Table name: admins
#
#  id                     :bigint           not null, primary key
#  pseudo                 :string           default(""), not null
#  additional_info        :string
#  locale                 :string           default("en")
#  settings               :jsonb            not null
#  slug                   :string
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
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

FactoryBot.define do

  factory :admin do
    sequence(:pseudo)     { |n| "Admin #{n + 1}" }
    sequence(:email)      { |n| "admin_#{n + 1}@example.com" }
    additional_info       { 'Personal information' }
    locale                { 'fr' }
    password              { 'password' }
    password_confirmation { 'password' }
    # settings              { {} }

    # after(:build) { |admin| admin.class.skip_callback(:create, :after, :create_blog_environment, raise: false) }

    # trait :with_blog do
    #   after(:create) { |admin| admin.send(:create_blog_environment) }
    # end
  end

end
