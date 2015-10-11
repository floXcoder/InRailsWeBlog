# == Schema Information
#
# Table name: preferences
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  name       :string           not null
#  value      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :preference do
    
  end

end
