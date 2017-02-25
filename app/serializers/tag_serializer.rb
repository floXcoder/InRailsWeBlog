# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id             :integer          not null
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  priority              :integer          default(0), not null
#  visibility            :integer          default(0), not null
#  archived              :boolean          default(FALSE), not null
#  accepted              :boolean          default(TRUE), not null
#  tagged_articles_count :integer          default(0)
#  slug                  :string
#  deleted_at            :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
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
             :slug

  belongs_to :user

  has_many :parents, serializer: TagSampleSerializer
  has_many :children, serializer: TagSampleSerializer

  def visibility_translated
    object.visibility_to_tr
  end

  def parents
    object.parents.everyone_and_user(current_user&.id)
  end

  def children
    object.children.everyone_and_user(current_user&.id)
  end
end
