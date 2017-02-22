# == Schema Information
#
# Table name: tag_relationships
#
#  id          :integer          not null, primary key
#  parent_id   :integer          not null
#  child_id    :integer          not null
#  article_ids :string           not null, is an Array
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryGirl.define do
  factory :tag_relationship do

  end
end
