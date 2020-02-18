# frozen_string_literal: true

require 'rails_helper'

describe 'Share API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @public_topic  = create(:topic, user: @user, visibility: :everyone)
    @private_topic = create(:topic, user: @user, visibility: :only_me)

    @private_article = create(:article, user: @user, topic: @private_topic, visibility: :only_me)
    @public_article  = create(:article, user: @user, topic: @private_topic, visibility: :everyone)
  end

  describe '/api/v1/shares/topic' do
    before do
      @contributed_user = create(:user)
    end

    context 'when user is not connected' do
      it 'returns an error message' do
        post '/api/v1/shares/topic', params: { share: { topic_id: @public_topic.id, login: @contributed_user.pseudo } }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the shared topic' do
        expect {
          post '/api/v1/shares/topic', params: { share: { topic_id: @public_topic.id, login: @contributed_user.pseudo } }, as: :json

          expect(response).to be_json_response

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['relationships']['contributors']['data'].size).to eq(1)
          expect(topic['data']['relationships']['contributors']['data'][0]['id']).to eq(@contributed_user.id.to_s)
        }.to change(Share, :count).by(1)

        expect(@public_topic.contributors).to match_array([@contributed_user])
        expect(@user.shared_topics).to match_array([@public_topic])
        expect(@contributed_user.contributed_topics).to match_array([@public_topic])
      end

      context 'when sharing a topic already shared' do
        before do
          ::Shares::StoreService.new(@public_topic, login: @contributed_user.email, current_user: @user).perform
        end

        it 'returns the errors' do
          expect {
            post '/api/v1/shares/topic', params: { share: { topic_id: @public_topic.id, login: @contributed_user.pseudo } }, as: :json

            expect(response).to be_json_response(422)

            topic = JSON.parse(response.body)
            expect(topic['errors']).to eq(I18n.t('views.share.errors.user_already_shared'))
          }.not_to change(Share, :count)
        end
      end

      context 'when sharing a private topic' do
        it 'returns the errors' do
          expect {
            post '/api/v1/shares/topic', params: { share: { topic_id: @private_topic.id, login: @contributed_user.pseudo } }, as: :json

            expect(response).to be_json_response(422)

            topic = JSON.parse(response.body)
            expect(topic['errors']).to eq(I18n.t('views.share.errors.private_shareable'))
          }.not_to change(Share, :count)
        end
      end
    end
  end

  describe '/api/v1/shares/article' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post '/api/v1/shares/article', params: { share: { article_id: @private_article.id } }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the shared article' do
        expect {
          post '/api/v1/shares/article', params: { share: { article_id: @private_article.id } }, as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['publicShareLink']).to be_a(String)
        }.to change(Share, :count).by(1)

        expect(@private_article.public_share_link).to be_a(String)
      end

      context 'when sharing an article already shared' do
        before do
          ::Shares::StoreService.new(@private_article, current_user: @user).perform
        end

        it 'returns the errors' do
          expect {
            post '/api/v1/shares/article', params: { share: { article_id: @private_article.id } }, as: :json

            expect(response).to be_json_response(422)

            article = JSON.parse(response.body)
            expect(article['errors']).to eq(I18n.t('views.share.errors.link_already_shared'))
          }.not_to change(Share, :count)
        end
      end

      context 'when sharing a public article' do
        it 'returns the errors' do
          expect {
            post '/api/v1/shares/article', params: { share: { article_id: @public_article.id } }, as: :json

            expect(response).to be_json_response(422)

            article = JSON.parse(response.body)
            expect(article['errors']).to eq(I18n.t('views.share.errors.useless_shareable'))
          }.not_to change(Share, :count)
        end
      end
    end
  end

end
