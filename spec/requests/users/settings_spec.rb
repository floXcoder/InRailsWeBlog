require 'rails_helper'

describe 'User Settings API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
  end

  describe '/users/:user_id/settings' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/users/#{@user.id}/settings", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/users/#{@user.id}/settings", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the default user settings' do
        get "/users/#{@user.id}/settings", as: :json

        expect(response).to be_json_response

        settings = JSON.parse(response.body)
        expect(settings['settings']['article_display']).to eq('card')
        expect(settings['settings']['search_highlight']).to be true
      end
    end
  end

  describe '/users/:user_id/settings (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/users/#{@user.id}/settings", params: { settings: { article_display: 'inline', search_highlight: false } }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated topic' do
        post "/users/#{@user.id}/settings", params: { settings: { article_display: 'inline', search_highlight: false } }, as: :json

        expect(response).to be_json_response

        settings = JSON.parse(response.body)
        expect(settings['settings']['article_display']).to eq('inline')
        expect(settings['settings']['search_highlight']).to be false
      end
    end
  end

end
