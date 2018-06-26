# == Schema Information
#
# Table name: votes
#
#  id            :bigint(8)        not null, primary key
#  voteable_type :string           not null
#  voteable_id   :bigint(8)        not null
#  voter_type    :string
#  voter_id      :bigint(8)
#  vote          :boolean          default(FALSE), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryBot.define do

  factory :vote do
    # voter
    # voteable

    vote true
  end

end
