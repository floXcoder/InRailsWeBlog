# == Schema Information
#
# Table name: bookmarks
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)        not null
#  bookmarked_type :string           not null
#  bookmarked_id   :bigint(8)        not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryBot.define do

  factory :bookmark do
    # user
    # bookmarked

    follow true
  end

end
