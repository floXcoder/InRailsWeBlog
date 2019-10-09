# frozen_string_literal: true
# == Schema Information
#
# Table name: bookmarks
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  bookmarked_type :string           not null
#  bookmarked_id   :integer          not null
#  follow          :boolean          default("false")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  topic_id        :integer
#

FactoryBot.define do

  factory :bookmark do
    # user
    # bookmarked
    # topic

    follow { true }
  end

end
