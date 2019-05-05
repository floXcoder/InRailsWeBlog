# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id                       :bigint           not null, primary key
#  user_id                  :bigint
#  name                     :string           not null
#  description_translations :jsonb
#  languages                :string           default([]), is an Array
#  synonyms                 :string           default([]), is an Array
#  color                    :string
#  notation                 :integer          default(0)
#  priority                 :integer          default(0)
#  visibility               :integer          default("everyone"), not null
#  accepted                 :boolean          default(TRUE), not null
#  archived                 :boolean          default(FALSE), not null
#  allow_comment            :boolean          default(TRUE), not null
#  pictures_count           :integer          default(0)
#  tagged_articles_count    :integer          default(0)
#  bookmarks_count          :integer          default(0)
#  comments_count           :integer          default(0)
#  slug                     :string
#  deleted_at               :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class TagSerializer < ActiveModel::Serializer
  # cache key: 'tag', expires_in: InRailsWeBlog.config.cache_time

  attributes :id,
             :name,
             :description,
             :synonyms,
             :priority,
             :visibility,
             :visibility_translated,
             :tagged_articles_count,
             :slug,
             :child_only,
             :parent_ids,
             :child_ids

  def visibility_translated
    object.visibility_to_tr
  end

  def child_only
    object.child_only_for_topic(instance_options[:current_topic_id])
  end

  def parent_ids
    object.child_relationships.select { |relation| relation.topic_id == instance_options[:current_topic_id] }.map(&:parent_id).uniq if instance_options[:current_topic_id]
  end

  def child_ids
    object.parent_relationships.select { |relation| relation.topic_id == instance_options[:current_topic_id] }.map(&:child_id).uniq if instance_options[:current_topic_id]
  end
end
