# == Schema Information
#
# Table name: pictures
#
#  id             :integer          not null, primary key
#  imageable_id   :integer          not null
#  imageable_type :string           not null
#  image          :string
#  image_tmp      :string
#  priority       :integer          default(0), not null
#  accepted       :boolean          default(TRUE), not null
#  deleted_at     :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :picture do
    priority       { Random.rand(0..10) }
    accepted       true

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
