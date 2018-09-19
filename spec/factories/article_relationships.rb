# frozen_string_literal: true

# == Schema Information
#
# Table name: article_relationships
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  parent_id  :bigint(8)        not null
#  child_id   :bigint(8)        not null
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
