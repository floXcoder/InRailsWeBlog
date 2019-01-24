# frozen_string_literal: true
# == Schema Information
#
# Table name: topics
#
#  id                       :bigint(8)        not null, primary key
#  user_id                  :bigint(8)
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

class TopicSerializer < ActiveModel::Serializer
  cache key: 'topic', expires_in: CONFIG.cache_time

  attributes :id,
             :user_id,
             :mode,
             :name,
             :description,
             :priority,
             :visibility,
             :visibility_translated,
             :updated_at,
             :settings,
             :slug

  has_many :tags, if: -> { instance_options[:with_tags] }, serializer: TagSerializer do
    Tag.includes(:parents, :children).for_topic(object.id).order('tags.priority', 'tags.name')
  end

  has_many :contributors, serializer: UserStrictSerializer

  def visibility_translated
    object.visibility_to_tr
  end
end
