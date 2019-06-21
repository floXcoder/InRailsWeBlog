# frozen_string_literal: true

# == Schema Information
#
# Table name: articles
#
#  id                      :bigint           not null, primary key
#  user_id                 :bigint
#  topic_id                :bigint
#  mode                    :integer          default("note"), not null
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
#  contributor_id          :bigint
#  inventories             :jsonb            not null
#

FactoryBot.define do

  factory :article do
    # user
    # topic

    mode          { 'note' }
    title         { Faker::Lorem.sentence } # title_translations
    summary       { Faker::Lorem.paragraph(1, false) } # summary_translations
    content       { Faker::Lorem.paragraph(1..20) } # content_translations
    languages     { ['fr'] }
    reference     { Faker::Internet.url }
    inventories   { {} }
    notation      { Random.rand(1..5) }
    priority      { Random.rand(0..100) }
    visibility    { 'everyone' }
    allow_comment { true }
    draft         { false }

    transient do
      tags        { [] }
      parent_tags { [] }
      child_tags  { [] }
    end

    after(:build) do |article, evaluator|
      if evaluator.parent_tags.present? && evaluator.child_tags.present?
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
      elsif evaluator.tags.present?
        evaluator.tags.map do |tag|
          article.tagged_articles << build(:tagged_article, tag: tag, user: article.user, topic: article.topic)
        end
      else
        article.tagged_articles << build(:tagged_article, tag: Tag.create(name: SecureRandom.uuid, user: article.user, visibility: article.visibility), user: article.user, topic: article.topic) unless article.draft?
      end
    end
  end

end
