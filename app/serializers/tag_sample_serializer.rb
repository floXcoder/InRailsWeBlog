# == Schema Information
#
# Table name: tags
#
#  id                    :integer          not null, primary key
#  user_id               :integer
#  name                  :string           not null
#  description           :text
#  synonyms              :string           default([]), is an Array
#  color                 :string
#  notation              :integer          default(0)
#  priority              :integer          default(0)
#  visibility            :integer          default("everyone"), not null
#  accepted              :boolean          default(TRUE), not null
#  archived              :boolean          default(FALSE), not null
#  pictures_count        :integer          default(0)
#  tagged_articles_count :integer          default(0)
#  bookmarks_count       :integer          default(0)
#  slug                  :string
#  deleted_at            :datetime
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class TagSampleSerializer < ActiveModel::Serializer
  cache key: 'tag_sample', expires_in: 12.hours

  attributes :id,
             :user_id,
             :name,
             :description,
             :synonyms,
             :visibility,
             :tagged_articles_count,
             :slug

  def description
    object.description.summary
  end
end
