# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks
#
#  id              :bigint           not null, primary key
#  user_id         :bigint           not null
#  bookmarked_type :string           not null
#  bookmarked_id   :bigint           not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  topic_id        :bigint
#

FactoryBot.define do

  factory :bookmark do
    # user
    # bookmarked
    # topic

    follow { true }
  end

end
