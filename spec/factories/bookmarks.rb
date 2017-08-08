# == Schema Information
#
# Table name: bookmarks
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  bookmarked_type :string           not null
#  bookmarked_id   :integer          not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do

  factory :bookmark do
    # user
    # bookmarked

    follow true
  end

end
