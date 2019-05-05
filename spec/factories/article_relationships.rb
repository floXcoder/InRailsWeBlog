# frozen_string_literal: true

# == Schema Information
#
# Table name: article_relationships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  parent_id  :bigint           not null
#  child_id   :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :article_relationship do
    # user

    # parent (article)
    # child (article)
  end

end
