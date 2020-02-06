# frozen_string_literal: true

require 'rails_helper'

describe 'Users Registration API', type: :request, basic: true do

  before(:all) do
    @user = create(:user, pseudo: 'Main User', password: 'password')
  end

  describe '/api/v1/signup' do
    context 'when registering with valid credentials' do
      it 'returns the user' do
        expect {
          post '/api/v1/signup', params: { user: { pseudo: 'pseudo', email: 'test@test.com', password: 'password', password_confirmation: 'password' } }, as: :json

          expect(response).to be_json_response(201)

          user = JSON.parse(response.body)
          expect(user['data']['attributes']).not_to be_empty
          expect(user['data']['attributes']['pseudo']).to eq('pseudo')
          expect(user['data']['attributes']['slug']).to eq('pseudo')
          expect(user['data']['attributes']['settings']).not_to be_empty
          expect(user['data']['relationships']['currentTopic']).not_to be_empty
          expect(user['data']['relationships']['topics']).not_to be_empty
        }.to change(User, :count).by(1)

        expect(User.last.pseudo).to eq('pseudo')
        expect(User.last.current_topic.name).to eq(I18n.t('topic.default_name'))
      end
    end

    context 'when registering with invalid credentials' do
      it 'returns an error for missing parameters' do
        expect {
          post '/api/v1/signup', params: { user: { email: 'test@test.com', password: 'password', password_confirmation: 'password' } }, as: :json

          expect(response).to be_json_response(422)

          user = JSON.parse(response.body)
          expect(user['errors']).not_to be_empty
        }.not_to change(User, :count)
      end
    end
  end

end
