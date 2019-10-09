# frozen_string_literal: true
# == Schema Information
#
# Table name: settings
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  value      :text
#  value_type :integer          default("0"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :setting do

  end
end
