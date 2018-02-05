# == Schema Information
#
# Table name: tags
#
#  id                       :integer          not null, primary key
#  user_id                  :integer
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
  cache key: 'tag', expires_in: 12.hours

  attributes :id,
             :name,
             :description,
             :synonyms,
             :priority,
             :visibility,
             :visibility_translated,
             :tagged_articles_count,
             :slug,
             :parent_ids,
             :child_ids

  belongs_to :user, serializer: UserSampleSerializer

  def visibility_translated
    object.visibility_to_tr
  end

  def parent_ids
    instance_options[:current_topic_id] ? object.child_relationships.where(topic_id: instance_options[:current_topic_id]).distinct.pluck(:parent_id) : object.parent_ids
  end

  def child_ids
    instance_options[:current_topic_id] ? object.parent_relationships.where(topic_id: instance_options[:current_topic_id]).distinct.pluck(:child_id) : object.child_ids
  end
end
