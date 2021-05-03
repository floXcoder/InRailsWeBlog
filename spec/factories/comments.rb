# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  user_id          :bigint           not null
#  commentable_type :string           not null
#  commentable_id   :bigint           not null
#  title            :string
#  subject          :string
#  body             :text
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  ask_for_deletion :boolean          default(FALSE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryBot.define do

  factory :comment do
    # user
    # commentable

    sequence(:title)  { |n| "Comment title #{n}" }
    subject           { Faker::Hipster.sentence(word_count: 3, supplemental: true) }
    body              { Faker::Hipster.paragraph(sentence_count: 2, supplemental: true, random_sentences_to_add: 3) }
    rating            { Random.rand(1..5) }
    positive_reviews  { Random.rand(0..10) }
    negative_reviews  { Random.rand(0..10) }
    accepted          { true }
    ask_for_deletion  { false }
  end

end
