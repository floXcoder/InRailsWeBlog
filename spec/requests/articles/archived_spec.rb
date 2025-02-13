# frozen_string_literal: true

require 'rails_helper'

describe 'Archived Article API', type: :request do

  before(:all) do
    @user = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, visibility: :everyone, archived: false)
  end

  describe '/api/v1/articles/:article_id/archived (POST)' do
    before do
      logout
    end

    context 'when user is not connected' do
      it 'returns an error message' do
        post "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'set article as archived' do
        post "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_json_response
        article = response.parsed_body
        expect(article['data']['attributes']['archived']).to be true
      end
    end

    context 'when another user is connected and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns archived article' do
        post "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_unauthorized
      end
    end
  end

  describe '/api/v1/articles/:article_id/archived (DELETE)' do
    before do
      logout
    end

    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'set article as unarchived' do
        delete "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_json_response
        article = response.parsed_body
        expect(article['data']['attributes']['archived']).to be false
      end
    end

    context 'when another user is connected and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns unarchived article' do
        delete "/api/v1/articles/#{@article.id}/archived", as: :json

        expect(response).to be_unauthorized
      end
    end
  end

end
