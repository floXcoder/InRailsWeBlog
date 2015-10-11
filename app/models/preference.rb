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

class Preference < ActiveRecord::Base
  belongs_to :user

  validates_uniqueness_of :name, scope: :user_id
end
