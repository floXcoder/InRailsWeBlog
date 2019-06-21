# frozen_string_literal: true

# == Schema Information
#
# Table name: topics
#
#  id                       :bigint           not null, primary key
#  user_id                  :bigint
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  color                    :string
#  priority                 :integer          default(0), not null
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  pictures_count           :integer          default(0)
#  articles_count           :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  settings                 :jsonb            not null
#  mode                     :integer          default("default"), not null
#

FactoryBot.define do

  factory :topic do
    # user

    sequence(:name)          { |n| "Topic #{n}" }
    sequence(:description)   { |n| "Topic description #{n}" } # description_translations
    languages                     { ['fr'] }
    priority                      { 0 }
    visibility                    { 'everyone' }
    # settings                    { {} }

    transient do
      inventory_fields  { [] }
    end

    after(:build) do |topic, evaluator|
      if evaluator.inventory_fields.present?
        evaluator.inventory_fields.flatten.map do |inventory_field|
          topic.inventory_fields.build(inventory_field)
        end
      end
    end
  end

end
