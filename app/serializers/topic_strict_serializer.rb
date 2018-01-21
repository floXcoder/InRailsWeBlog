# == Schema Information
#
# Table name: topics
#
#  id                       :integer          not null, primary key
#  user_id                  :integer
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
#

class TopicStrictSerializer < ActiveModel::Serializer
  cache key: 'topic_strict', expires_in: 12.hours

  include NullAttributesRemover

  # Methods with attributes must be defined to work with searchkick results
  attributes :id,
             :user_id,
             :name,
             :visibility,
             :slug

  def id
    object.id
  end

  def user_id
    object.user_id
  end

  def name
    object.name
  end

  def visibility
    object.visibility
  end

  def slug
    object.slug
  end
end
