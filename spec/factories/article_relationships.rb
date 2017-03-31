# == Schema Information
#
# Table name: article_relationships
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  parent_id  :integer          not null
#  child_id   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do

  factory :article_relationship do
    # article
    # article
  end

end
