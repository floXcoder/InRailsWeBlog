# frozen_string_literal: true
# == Schema Information
#
# Table name: tag_relationships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  topic_id   :bigint           not null
#  article_id :bigint           not null
#  parent_id  :bigint           not null
#  child_id   :bigint           not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :tag_relationship do
    # user
    # topic

    # article

    # parent (tag)
    # child (tag)
  end

end
