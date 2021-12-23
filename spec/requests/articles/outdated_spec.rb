# frozen_string_literal: true

require 'rails_helper'

describe 'Outdated Article API', type: :request do

  before(:all) do
    @user         = create(:user)
    @other_user   = create(:user)
    @another_user = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  describe '/api/v1/articles/:article_id/outdated (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          post "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_unauthenticated
        }.not_to change(OutdatedArticle, :count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'marks article as outdated' do
        expect {
          post "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_json_response
          article = JSON.parse(response.body)
          expect(article['data']['id']).to eq(@article.id.to_s)
        }.to change(OutdatedArticle, :count).by(1)
      end
    end

    context 'when another user is connected and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns ok' do
        expect {
          post "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_json_response
          article = JSON.parse(response.body)
          expect(article['data']['id']).to eq(@article.id.to_s)
        }.to change(OutdatedArticle, :count).by(1)
      end
    end
  end

  describe '/api/v1/articles/:article_id/outdated (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          delete "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_unauthenticated
        }.not_to change(OutdatedArticle, :count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        @article.mark_as_outdated(@user)
      end

      it 'unmarks the article' do
        expect {
          delete "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_json_response
          article = JSON.parse(response.body)
          expect(article['data']['id']).to eq(@article.id.to_s)
        }.to change(OutdatedArticle, :count).by(-1)
      end
    end

    context 'when another user is connected but he did not marked as outdated and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)

        @article.mark_as_outdated(@another_user)
      end

      it 'cannot unmark an article not outdated' do
        expect {
          delete "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_json_response(422)
        }.not_to change(OutdatedArticle, :count)
      end
    end

    context 'when another user is connected and he marked it as outdated and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)

        @article.mark_as_outdated(@other_user)
      end

      it 'returns ok' do
        expect {
          delete "/api/v1/articles/#{@article.id}/outdated", as: :json

          expect(response).to be_json_response
          article = JSON.parse(response.body)
          expect(article['data']['id']).to eq(@article.id.to_s)
        }.to change(OutdatedArticle, :count).by(-1)
      end
    end
  end

end
