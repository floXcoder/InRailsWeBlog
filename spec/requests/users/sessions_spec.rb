# frozen_string_literal: true

require 'rails_helper'

describe 'Users Session API', type: :request, basic: true do

  before(:all) do
    @user = create(:user, pseudo: 'Main User', password: 'password')
  end

  describe '/api/v1/login' do
    context 'when connecting with valid credentials' do
      it 'returns the user' do
        post '/api/v1/login', params: { user: { login: @user.pseudo, password: 'password' } }, as: :json

        expect(response).to be_json_response(200)

        user = JSON.parse(response.body)
        expect(user['user']).not_to be_empty
        expect(user['user']['pseudo']).to eq('Main User')
      end
    end

    context 'when connecting with invalid credentials' do
      it 'returns an error for unknown user' do
        post '/api/v1/login', params: { user: { login: @user.pseudo, password: 'bad password' } }, as: :json

        expect(response).to be_json_response(401)

        user = JSON.parse(response.body)
        expect(user['error']).to eq(I18n.t('devise.failure.unauthenticated'))
      end

      it 'returns an error for incorrect password' do
        post '/api/v1/login', params: { user: { login: 'bad_user', password: 'bad password' } }, as: :json

        expect(response).to be_json_response(401)

        user = JSON.parse(response.body)
        expect(user['error']).to eq(I18n.t('devise.failure.unauthenticated'))
      end
    end
  end

end
