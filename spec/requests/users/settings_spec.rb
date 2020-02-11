# frozen_string_literal: true

require 'rails_helper'

describe 'User Settings API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
  end

  describe '/api/v1/users/:user_id/settings' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/users/#{@user.id}/settings", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/users/#{@user.id}/settings", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the default user settings' do
        get "/api/v1/users/#{@user.id}/settings", as: :json

        expect(response).to be_json_response

        settings = JSON.parse(response.body)
        expect(settings['data']['attributes']['articlesLoader']).to eq('infinite')
        expect(settings['data']['attributes']['articleDisplay']).to eq('summary')
        expect(settings['data']['attributes']['articleMultilanguage']).to be false
        expect(settings['data']['attributes']['tagSidebarWithChild']).to be false
        expect(settings['data']['attributes']['searchDisplay']).to eq('card')
        expect(settings['data']['attributes']['searchHighlight']).to be true
      end
    end
  end

  describe '/api/v1/users/:user_id/settings (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/api/v1/users/#{@user.id}/settings", params: { settings: { article_display: 'inline', search_highlight: false } }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated topic' do
        post "/api/v1/users/#{@user.id}/settings", params: { settings: { article_display: 'inline', search_highlight: false } }, as: :json

        expect(response).to be_json_response

        settings = JSON.parse(response.body)
        expect(settings['data']['attributes']['articleDisplay']).to eq('inline')
        expect(settings['data']['attributes']['tagSidebarWithChild']).to be false
        expect(settings['data']['attributes']['searchHighlight']).to be false
      end
    end
  end

end
