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

RSpec.describe Picture, type: :model do

  before do
    @picture = Picture.create(
        imageable_id:   0,
        imageable_type: 'Ride',
        image:          'my_image',
        image_tmp:      'my_tmp_image'
    )
  end

  subject { @picture }

  context 'Picture model' do

    describe 'picture object', basic: true do
      it { is_expected.to be_valid }
    end

    describe '#imageable_id', basic: true do
      it { is_expected.to respond_to(:imageable_id) }
      it { is_expected.to have_db_index([:imageable_type, :imageable_id]) }
      it { expect(@picture.imageable_id).to eq(0) }
    end

    describe '#imageable_type', basic: true do
      it { is_expected.to respond_to(:imageable_type) }
      it { is_expected.to validate_presence_of(:imageable_type) }
      it { expect(@picture.imageable_type).to eq('Ride') }
    end

    describe '#image', basic: true do
      it { is_expected.to respond_to(:image) }
      it { expect(@picture.image).to be_kind_of(PictureUploader) }
    end

    describe '#image_tmp', basic: true do
      it { is_expected.to respond_to(:image_tmp) }
      it { expect(@picture.image_tmp).to eq('my_tmp_image') }
    end

    # describe '.image_size', basic: true do
    #   it { is_expected.to respond_to(:image_size) }
    #   it { is_expected.to allow_value(image).for(:image).with_message(I18n.t('activerecord.errors.models.picture.image_size')) }
    # end

  end

  context 'associations' do
    describe 'relations', basic: true do
      it { is_expected.to belong_to(:imageable) }
    end
  end

end
