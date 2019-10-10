# frozen_string_literal: true
# == Schema Information
#
# Table name: tag_relationships
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  topic_id   :integer          not null
#  article_id :integer          not null
#  parent_id  :integer          not null
#  child_id   :integer          not null
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
