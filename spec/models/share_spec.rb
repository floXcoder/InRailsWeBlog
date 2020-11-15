# frozen_string_literal: true

# == Schema Information
#
# Table name: shares
#
#  id             :bigint           not null, primary key
#  user_id        :bigint           not null
#  shareable_type :string           not null
#  shareable_id   :bigint           not null
#  contributor_id :bigint           not null
#  mode           :integer          default("link"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  shared_link    :string
#

require 'rails_helper'

RSpec.describe Share, type: :model, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @contributed_user = create(:user)

    @article = create(:article, user: @user, topic: @topic)
    @tag     = create(:tag, user: @user)

    @other_topic = create(:topic, user: @user)
    @other_user  = create(:user)
  end

  before do
    @share = Share.create(
      mode:        :with_user,
      user:        @user,
      shareable:   @topic,
      contributor: @contributed_user
    )
  end

  subject { @share }

  context 'Object' do
    it { is_expected.to be_valid }
  end

  context 'Attributes' do
    it { is_expected.to respond_to(:user) }
    it { is_expected.to respond_to(:shareable) }
    it { is_expected.to respond_to(:contributor) }
    it { is_expected.to respond_to(:mode) }

    describe 'Default Attributes' do
      it { expect(@share.mode).to eq('with_user') }
    end

    describe '#mode' do
      it { is_expected.to have_enum(:mode) }
      it { is_expected.to validate_presence_of(:mode) }
    end
  end

  context 'Associations' do
    it { is_expected.to belong_to(:user) }

    it { is_expected.to belong_to(:shareable) }

    # it { is_expected.to belong_to(:contributor).optional }

    it { is_expected.to validate_presence_of(:user) }

    it { is_expected.to validate_presence_of(:shareable) }

    # it { is_expected.to validate_presence_of(:contributor) }

    # it { is_expected.to validate_uniqueness_of(:user_id).scoped_to([:shareable_id, :shareable_type, :contributor_id]).with_message(I18n.t('activerecord.errors.models.share.already_shared')) }
  end

  context 'Public Methods' do
    subject { Share }

    describe '::topics' do
      it { is_expected.to respond_to(:topics) }
      it { expect(Share.topics).to include(@share) }
    end

    describe '::articles' do
      it { is_expected.to respond_to(:articles) }
    end

    describe '::shared_with?' do
      it { is_expected.to respond_to(:shared_with?) }
      it { expect(Share.shared_with?(@user.id, @topic, @contributed_user.id)).to be true }
      it { expect(Share.shared_with?(@user.id, @other_topic, @contributed_user.id)).to be false }
      it { expect(Share.shared_with?(@user.id, @topic, @other_user.id)).to be false }
    end
  end

  context 'Instance Methods' do
    describe '.user?' do
      it { is_expected.to respond_to(:user?) }
      it { expect(@share.user?(@user)).to be true }
      it { expect(@share.user?(@other_user)).to be false }
    end
  end

end
