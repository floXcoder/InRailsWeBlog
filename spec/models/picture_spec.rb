# frozen_string_literal: true

# == Schema Information
#
# Table name: pictures
#
#  id                 :bigint           not null, primary key
#  user_id            :bigint           not null
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
require 'rails_helper'

RSpec.describe Picture, type: :model, basic: true do

  before(:all) do
    @user    = create(:user)
    @topic   = create(:topic, user: @user)
    @article = create(:article, user: @user, topic: @topic)
  end

  before do
    @picture = Picture.create(
      user:               @user,
      imageable:          @article,
      description:        'Picture description',
      copyright:          'Picture copyright',
      image:              'my_image.jpg',
      image_tmp:          'my_tmp_image',
      priority:           10,
      accepted:           true,
      image_secure_token: '12aa100f-4514-4a48-b1a0-51eece8f35f7',
      original_filename:  'image_original_filename.jpg'
    )
  end

  subject { @picture }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:imageable_id) }
    it { is_expected.to respond_to(:imageable_type) }
    it { is_expected.to respond_to(:description) }
    it { is_expected.to respond_to(:copyright) }
    it { is_expected.to respond_to(:image) }
    it { is_expected.to respond_to(:image_tmp) }
    it { is_expected.to respond_to(:priority) }
    it { is_expected.to respond_to(:accepted) }
    it { is_expected.to respond_to(:image_secure_token) }
    it { is_expected.to respond_to(:original_filename) }

    it { expect(@picture.imageable_type).to eq('Article') }
    it { expect(@picture.description).to eq('Picture description') }
    it { expect(@picture.copyright).to eq('Picture copyright') }
    it { expect(@picture.image).to be_a(PictureUploader) }
    it { expect(@picture.image_tmp).to eq('my_tmp_image') }
    it { expect(@picture.priority).to eq(10) }
    it { expect(@picture.accepted).to be true }
    it { expect(@picture.image_secure_token).to eq('12aa100f-4514-4a48-b1a0-51eece8f35f7') }
    it { expect(@picture.original_filename).to eq('image_original_filename.jpg') }

    describe '#user' do
      it { is_expected.to validate_presence_of(:user) }
      it { is_expected.to have_db_index(:user_id) }
    end

    describe '#imageable' do
      it { is_expected.to validate_presence_of(:imageable_type) }
      it { is_expected.to have_db_index([:imageable_id, :imageable_type]) }
    end

    describe 'Default Attributes' do
      before do
        @picture = Picture.create(
          user:      @user,
          imageable: @article,
          image:     'my_image.jpg',
          image_tmp: 'my_tmp_image'
        )
      end

      it { expect(@picture).to be_valid }
      it { expect(@picture.priority).to eq(0) }
      it { expect(@picture.accepted).to be true }
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:imageable).optional }
  end

  context 'Properties' do
    it { is_expected.to have_strip_attributes([:description, :copyright]) }

    it { is_expected.to act_as_paranoid(Picture) }
  end

  context 'Instance Methods' do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@picture.user?(@user)).to be true }
      it { expect(@picture.user?(create(:user))).to be false }
    end

    describe '.format_attributes' do
      it { is_expected.to respond_to(:format_attributes) }

      it 'format attributes' do
        picture_attributes = {
          model_id:    1,
          model:       'Article',
          description: 'Image description',
          copyright:   'Image copyright',
          file:        'image.jpg'
        }

        picture = Picture.new
        picture.format_attributes(picture_attributes)

        expect(picture.imageable_id).to eq(1)
        expect(picture.imageable_type).to eq('Article')
        expect(picture.description).to eq('Image description')
        expect(picture.copyright).to eq('Image copyright')
        expect(@picture.image).to be_a(PictureUploader)
      end
    end

    # describe '.image_size' do
    #   it { is_expected.to allow_value(image).for(:image).with_message(I18n.t('activerecord.errors.models.picture.image_size')) }
    # end
  end

end
