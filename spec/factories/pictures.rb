# frozen_string_literal: true

# == Schema Information
#
# Table name: pictures
#
#  id                 :bigint(8)        not null, primary key
#  user_id            :bigint(8)        not null
#  imageable_id       :integer
#  imageable_type     :string           not null
#  image              :string
#  image_tmp          :string
#  description        :text
#  copyright          :string
#  original_filename  :string
#  image_secure_token :string
#  priority           :integer          default(0), not null
#  accepted           :boolean          default(TRUE), not null
#  deleted_at         :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

FactoryBot.define do

  factory :picture do
    # user
    # imageable

    sequence(:description)  { |n| "Picture description #{n + 1}" }
    sequence(:copyright)    { |n| "Picture copyright #{n + 1}" }
    priority                { Random.rand(0..10) }
    accepted                { true }
    image_secure_token      { SecureRandom.uuid }
    original_filename       { Faker::Lorem.word }

    before(:create) do |picture, _evaluator|
      picture.image_tmp = nil
      picture.image = picture.image
    end
  end

end
