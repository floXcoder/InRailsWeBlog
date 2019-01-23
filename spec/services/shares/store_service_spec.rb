# frozen_string_literal: true

require 'rails_helper'

describe Shares::StoreService, type: :service, basic: true do
  subject { described_class.new }

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user, visibility: :everyone)

    @contributed_user = create(:user)

    @other_topic = create(:topic, user: @user, visibility: :only_me)
    @other_user  = create(:user)
  end

  describe '#perform' do
    context 'shares a topic' do
      it 'returns the update topic for user email' do
        share_results = ::Shares::StoreService.new(@topic, @contributed_user.email, current_user: @user).perform

        expect(share_results.success?).to be true
        expect(share_results.result).to be_kind_of(Topic)
        expect(share_results.result.contributors).to include(@contributed_user)
      end

      it 'returns the update topic for user pseudo' do
        share_results = ::Shares::StoreService.new(@topic, @contributed_user.pseudo, current_user: @user).perform

        expect(share_results.success?).to be true
        expect(share_results.result).to be_kind_of(Topic)
        expect(share_results.result.contributors).to include(@contributed_user)
      end
    end

    context 'shares already exist' do
      before do
        ::Shares::StoreService.new(@topic, @contributed_user.email, current_user: @user).perform
      end

      it 'returns an error' do
        share_results = ::Shares::StoreService.new(@topic, @contributed_user.email, current_user: @user).perform

        expect(share_results.success?).to be false
        expect(share_results.errors).to include(I18n.t('views.share.errors.already_shared'))
      end
    end

    context 'unknown user' do
      it 'returns an error' do
        share_results = ::Shares::StoreService.new(@topic, 'unknown user', current_user: @user).perform

        expect(share_results.success?).to be false
        expect(share_results.errors).to include(I18n.t('views.share.errors.user_not_found'))
      end
    end

    context 'private topic' do
      it 'returns an error' do
        share_results = ::Shares::StoreService.new(@other_topic, @contributed_user.email, current_user: @user).perform

        expect(share_results.success?).to be false
        expect(share_results.errors).to include(I18n.t('views.share.errors.private_shareable'))
      end
    end
  end

end
