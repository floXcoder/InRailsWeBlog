# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_type :string           not null
#  commentable_id   :integer          not null
#  user_id          :integer          not null
#  title            :string
#  body             :text
#  subject          :string
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryGirl.define do

  factory :comment do
    # user
    # commentable

    sequence(:title)  { |n| "Comment title #{n}" }
    subject           { Faker::Hipster.sentence(3, true) }
    body              { Faker::Hipster.paragraph(2, true, 3) }
    rating            { Random.rand(1..5) }
    positive_reviews  { Random.rand(0..10) }
    negative_reviews  { Random.rand(0..10) }
    accepted          true
    ask_for_deletion  false
  end

end
