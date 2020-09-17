# frozen_string_literal: true

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

class Topic::InventoryFieldSerializer
  include FastJsonapi::ObjectSerializer

  set_type :inventory_field

  set_key_transform :camel_lower

  attributes :id,
             :name,
             :field_name,
             :value_type,
             :required,
             :searchable,
             :filterable,
             :priority

end
