# frozen_string_literal: true
# == Schema Information
#
# Table name: shares
#
#  id             :bigint           not null, primary key
#  user_id        :bigint           not null
#  shareable_type :string           not null
#  shareable_id   :bigint           not null
#  contributor_id :bigint
#  mode           :integer          default("link"), not null
#  public_link    :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryBot.define do
  factory :share do
    # user

    # shareable

    # contributor
  end
end
