# frozen_string_literal: true
# == Schema Information
#
# Table name: shares
#
#  id             :integer          not null, primary key
#  user_id        :integer          not null
#  shareable_type :string           not null
#  shareable_id   :integer          not null
#  contributor_id :integer
#  mode           :integer          default("0"), not null
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
