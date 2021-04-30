# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_blogs
#
#  id         :bigint           not null, primary key
#  admin_id   :bigint           not null
#  visibility :integer          default("everyone"), not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :admin_blog, class: 'Admin::Blog' do

    title       { Faker::Lorem.sentence }
    content     { Faker::Lorem.paragraph(sentence_count: 1..20) }
    visibility  { 'everyone' }

  end
end
