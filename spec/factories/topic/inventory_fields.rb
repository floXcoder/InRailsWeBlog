# == Schema Information
#
# Table name: topic_inventory_fields
#
#  id              :bigint           not null, primary key
#  topic_id        :bigint
#  name            :string           not null
#  field_name      :string           not null
#  value_type      :integer          default("string_type"), not null
#  parent_category :string
#  required        :boolean          default(FALSE), not null
#  searchable      :boolean          default(FALSE), not null
#  filterable      :boolean          default(FALSE), not null
#  priority        :integer          default(0), not null
#  visibility      :integer          default("everyone"), not null
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryBot.define do

  factory :topic_inventory_field, class: 'Topic::InventoryField' do
    # topic

    name { Faker::Lorem.word }
    field_name { Faker::Lorem.word.to_s.capitalize }
    value_type { Random.rand(1..5) }
    parent_category { nil }
    required { false }
    searchable { false }
    filterable { false }
    priority { Random.rand(1..5) }
    visibility { 'only_me' }
  end

end
