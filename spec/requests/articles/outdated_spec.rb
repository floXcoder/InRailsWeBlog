require 'rails_helper'

describe 'Outdated Article API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  describe '/articles/:article_id/outdated (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/articles/#{@article.id}/outdated", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'cannot marked as outdated his article' do
        post "/articles/#{@article.id}/outdated", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns ok' do
        expect {
          post "/articles/#{@article.id}/outdated", as: :json
        }.to change(OutdatedArticle, :count).by(1)

        expect(response).to be_json_response
        expect(response.body).to be_empty
      end
    end
  end

  describe '/articles/:article_id/outdated (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/articles/#{@article.id}/outdated", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'cannot marked as outdated his article' do
        post "/articles/#{@article.id}/outdated", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)

        @article.mark_as_outdated(@other_user)
      end

      it 'returns ok' do
        expect {
          delete "/articles/#{@article.id}/outdated", as: :json
        }.to change(OutdatedArticle, :count).by(-1)

        expect(response).to be_json_response
        expect(response.body).to be_empty
      end
    end
  end

end
