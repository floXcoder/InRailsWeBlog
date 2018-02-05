# == Schema Information
#
# Table name: articles
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  topic_id                :integer
#  mode                    :integer          default("story"), not null
#  title_translations      :jsonb
#  summary_translations    :jsonb
#  content_translations    :jsonb            not null
#  languages               :string           default([]), not null, is an Array
#  reference               :text
#  draft                   :boolean          default(FALSE), not null
#  notation                :integer          default(0)
#  priority                :integer          default(0)
#  visibility              :integer          default("everyone"), not null
#  accepted                :boolean          default(TRUE), not null
#  archived                :boolean          default(FALSE), not null
#  allow_comment           :boolean          default(TRUE), not null
#  pictures_count          :integer          default(0)
#  outdated_articles_count :integer          default(0)
#  bookmarks_count         :integer          default(0)
#  comments_count          :integer          default(0)
#  slug                    :string
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

FactoryBot.define do

  factory :article do
    # user
    # topic

    mode            'story'
    title           { Faker::Lorem.sentence } # title_translations
    summary         { Faker::Lorem.paragraph(1, false) } # summary_translations
    content         { Faker::Lorem.paragraph(1..20) } # content_translations
    languages       ['fr']
    reference       { Faker::Internet.url }
    notation        0
    priority        0
    visibility      'everyone'
    allow_comment   true

    factory :article_with_tags do
      transient do
        tags []
      end

      after(:build) do |article, evaluator|
        evaluator.tags.map do |tag|
          article.tagged_articles << build(:tagged_article, tag: tag, user: article.user, topic: article.topic)
        end
      end
    end

    factory :article_with_relation_tags do
      transient do
        parent_tags []
        child_tags []
      end

      after(:build) do |article, evaluator|
        evaluator.parent_tags.flatten.map do |tag|
          article.tagged_articles << build(:tagged_article, tag: tag, user: article.user, topic: article.topic, parent: true)
        end

        evaluator.child_tags.flatten.map do |tag|
          article.tagged_articles << build(:tagged_article, tag: tag, user: article.user, topic: article.topic, child: true)
        end

        evaluator.parent_tags.map do |parent_tag|
          evaluator.child_tags.map do |child_tag|
            article.tag_relationships << TagRelationship.find_or_initialize_by(parent: parent_tag, child: child_tag, user: article.user, topic: article.topic)
          end
        end
      end
    end
  end

end
