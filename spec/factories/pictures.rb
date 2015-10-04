# == Schema Information
#
# Table name: pictures
#
#  id             :integer          not null, primary key
#  imageable_id   :integer          not null
#  imageable_type :string           not null
#  image          :string
#  image_tmp      :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :picture do


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
