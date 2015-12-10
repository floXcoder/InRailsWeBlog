# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_id   :integer
#  commentable_type :string
#  title            :string
#  body             :text
#  subject          :string
#  user_id          :integer          not null
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime
#  updated_at       :datetime
#

FactoryGirl.define do
  factory :comment do
    user
    title   { Faker::Hipster.sentence(3) }
    subject { Faker::Hipster.sentence(3, true) }
    body    { Faker::Hipster.paragraph(2, true, 3) }
  end
end
