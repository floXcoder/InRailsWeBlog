# frozen_string_literal: true
# == Schema Information
#
# Table name: votes
#
#  id            :integer          not null, primary key
#  voteable_type :string           not null
#  voteable_id   :integer          not null
#  voter_type    :string
#  voter_id      :integer
#  vote          :boolean          default("false"), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryBot.define do

  factory :vote do
    # voter
    # voteable

    vote { true }
  end

end
