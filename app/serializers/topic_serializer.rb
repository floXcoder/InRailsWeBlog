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

class TopicSerializer
  include FastJsonapi::ObjectSerializer

  # cache_options enabled: true, cache_length: InRailsWeBlog.config.cache_time

  set_key_transform :camel_lower

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :languages,
             :settings,
             :slug,
             :articles_count

  has_many :contributors, record_type: :user, serializer: UserStrictSerializer

  attribute :visibility_translated do |object|
    object.visibility_to_tr
  end

  attribute :inventory_fields do |object|
    Topic::InventoryFieldSerializer.new(object.inventory_fields).serializable_hash&.dig(:data)&.map { |d| d[:attributes] }
  end

end
