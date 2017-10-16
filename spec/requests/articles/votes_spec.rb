require 'rails_helper'

describe 'Vote Article API', type: :request, basic: true do

  before(:all) do
    @user         = create(:user)
    @other_user   = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  describe '/articles/:article_id/votes (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/articles/#{@article.id}/votes", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'cannot vote for his own article' do
        post "/articles/#{@article.id}/votes", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns ok' do
        expect {
          post "/articles/#{@article.id}/votes", as: :json

          expect(response).to be_json_response
          expect(response.body).to be_empty
        }.to change(Vote, :count).by(1)
      end
    end

    context 'when another user is connected and he has already voted' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
        @other_user.vote_against(@article)
      end

      it 'cannot vote again' do
        expect {
          post "/articles/#{@article.id}/votes", as: :json

          expect(response).to be_unauthorized
        }.not_to change(Vote, :count)
      end
    end
  end

  describe '/articles/:article_id/votes (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/articles/#{@article.id}/votes", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'cannot vote against for his own article' do
        post "/articles/#{@article.id}/votes", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected and article is public' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns ok' do
        expect {
          delete "/articles/#{@article.id}/votes", as: :json

          expect(response).to be_json_response
          expect(response.body).to be_empty
        }.to change(Vote, :count).by(1)
      end
    end

    context 'when another user is connected and he has already voted' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
        @other_user.vote_for(@article)
      end

      it 'cannot vote again' do
        expect {
          post "/articles/#{@article.id}/votes", as: :json

          expect(response).to be_unauthorized
        }.not_to change(Vote, :count)
      end
    end
  end

end
