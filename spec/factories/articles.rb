# == Schema Information
#
# Table name: articles
#
#  id                        :integer          not null, primary key
#  author_id                 :integer          not null
#  topic_id                  :integer          not null
#  title                     :string           default("")
#  summary                   :text             default("")
#  content                   :text             default(""), not null
#  private_content           :boolean          default(FALSE), not null
#  is_link                   :boolean          default(FALSE), not null
#  reference                 :text
#  temporary                 :boolean          default(FALSE), not null
#  language                  :string
#  allow_comment             :boolean          default(TRUE), not null
#  notation                  :integer          default(0)
#  priority                  :integer          default(0)
#  visibility                :integer          default(0), not null
#  archived                  :boolean          default(FALSE), not null
#  accepted                  :boolean          default(TRUE), not null
#  bookmarked_articles_count :integer          default(0)
#  outdated_articles_count   :integer          default(0)
#  slug                      :string
#  deleted_at                :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

FactoryGirl.define do

  factory :article do
    # user
    # topic

    title           { Faker::Lorem.sentence }
    summary         { Faker::Lorem.paragraph(1, false) }
    content         { Faker::Lorem.paragraph(1..20) }
    reference       ''
    language        'fr'
    allow_comment   true
    notation        0
    priority        0
    visibility      'everyone'
  end

  # Add equipments if :with_tag
  trait :with_tag do
    association     :tags, strategy: :build, user: user
  end

end
