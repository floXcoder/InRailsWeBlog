# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(FALSE), not null
#  private_content :boolean          default(FALSE), not null
#  is_link         :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do
  factory :article do
    author
    title           { Faker::Lorem.sentence }
    summary         { Faker::Lorem.paragraph(1, false) }
    content         { Faker::Lorem.paragraph(1..20) }
    visibility      'everyone'
    notation        0
    priority        0
    allow_comment   false
  end

  # Add equipments if :with_tag
  trait :with_tag do
    association     :tags
  end
end
