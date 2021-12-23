# frozen_string_literal: true

require 'rails_helper'

describe Shares::StoreService, type: :service do
  subject { described_class.new }

  before(:all) do
    @user           = create(:user)
    @topic          = create(:topic, user: @user, visibility: :everyone)
    @article        = create(:article, user: @user, topic: @topic, visibility: :only_me)
    @public_article = create(:article, user: @user, topic: @topic, visibility: :everyone)

    @contributed_user = create(:user)

    @other_topic = create(:topic, user: @user, visibility: :only_me)
    @other_user  = create(:user)
  end

  describe '#perform' do
    context 'topic' do
      context 'shares a topic' do
        it 'returns the updated topic for user email' do
          share_results = ::Shares::StoreService.new(@topic, login: @contributed_user.email, current_user: @user).perform

          expect(share_results.success?).to be true
          expect(share_results.result).to be_kind_of(Topic)
          expect(share_results.result.shares.last.mode).to eq('with_user')
          expect(share_results.result.contributors).to include(@contributed_user)
        end

        it 'returns the updated topic for user pseudo' do
          share_results = ::Shares::StoreService.new(@topic, login: @contributed_user.pseudo, current_user: @user).perform

          expect(share_results.success?).to be true
          expect(share_results.result).to be_kind_of(Topic)
          expect(share_results.result.shares.last.mode).to eq('with_user')
          expect(share_results.result.contributors).to include(@contributed_user)
        end
      end

      context 'shares already exist' do
        before do
          ::Shares::StoreService.new(@topic, login: @contributed_user.email, current_user: @user).perform
        end

        it 'returns an error' do
          share_results = ::Shares::StoreService.new(@topic, login: @contributed_user.email, current_user: @user).perform

          expect(share_results.success?).to be false
          expect(share_results.errors).to include(I18n.t('views.share.errors.user_already_shared'))
        end
      end

      context 'unknown user' do
        it 'returns an error' do
          share_results = ::Shares::StoreService.new(@topic, login: 'unknown user', current_user: @user).perform

          expect(share_results.success?).to be false
          expect(share_results.errors).to include(I18n.t('views.share.errors.user_not_found'))
        end
      end

      context 'private topic' do
        it 'returns an error' do
          share_results = ::Shares::StoreService.new(@other_topic, login: @contributed_user.email, current_user: @user).perform

          expect(share_results.success?).to be false
          expect(share_results.errors).to include(I18n.t('views.share.errors.private_shareable'))
        end
      end
    end

    context 'article' do
      context 'share an article' do
        it 'returns the updated article with the generated link' do
          share_results = ::Shares::StoreService.new(@article, current_user: @user).perform

          expect(share_results.success?).to be true
          expect(share_results.result).to be_kind_of(Article)
          expect(share_results.result.share.mode).to eq('link')
          expect(share_results.result.share.public_link).to be_a(String)
        end
      end

      context 'share link already exist' do
        before do
          ::Shares::StoreService.new(@article, current_user: @user).perform
        end

        it 'returns an error' do
          share_results = ::Shares::StoreService.new(@article, current_user: @user).perform

          expect(share_results.success?).to be false
          expect(share_results.errors).to include(I18n.t('views.share.errors.link_already_shared'))
        end
      end

      context 'share public article' do
        it 'returns an error' do
          share_results = ::Shares::StoreService.new(@public_article, current_user: @user).perform

          expect(share_results.success?).to be false
          expect(share_results.errors).to include(I18n.t('views.share.errors.useless_shareable'))
        end
      end
    end
  end

end
