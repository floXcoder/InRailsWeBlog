# == Schema Information
#
# Table name: pictures
#
#  id                 :integer          not null, primary key
#  user_id            :integer          not null
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

FactoryGirl.define do

  factory :picture do
    # user
    # imageable

    sequence(:description)  { |n| "Picture description #{n+1}" }
    sequence(:copyright)    { |n| "Picture copyright #{n+1}" }

    priority                { Random.rand(0..10) }
    accepted                true

    image_secure_token      { SecureRandom.uuid }
    original_filename       { Faker::Lorem.word }

    # Directly upload images without using background process
    transient do
      upload_now false
    end

    before(:create) do |picture, evaluator|
      if evaluator.upload_now
        # Bug in carrierwave backgrounder, direct upload must be set before image
        image = picture.image
        picture.image = nil
        picture.image_tmp = nil
        picture.process_image_upload = true
        picture.image = image
      end
    end
  end

end
