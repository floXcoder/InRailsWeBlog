# frozen_string_literal: true

require 'rails_helper'

describe 'Users API', type: :request do

  before(:all) do
    @admin = create(:admin)
    @user  = create(:user, pseudo: 'Main User')
    @users = create_list(:user, 5)
  end

  describe '/api/v1/users' do
    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all users' do
        get '/api/v1/users', as: :json

        expect(response).to be_json_response

        users = JSON.parse(response.body)
        expect(users['meta']['root']).to eq('users')
        expect(users['data']).not_to be_empty
        # expect(users['users'].size).to eq(6)
      end

      it 'limits the number of users' do
        create_list(:user, 10)

        get '/api/v1/users', as: :json

        users = JSON.parse(response.body)
        expect(users['meta']['root']).to eq('users')
        expect(users['data']).not_to be_empty
        expect(users['data'].size).to be <= InRailsWeBlog.settings.per_page
      end
    end
  end

  describe '/api/v1/users/validation' do
    it 'returns true if user exists' do
      get '/api/v1/users/validation', params: { user: { pseudo: 'Main User' } }, as: :json

      expect(response).to be_json_response(200)

      user = JSON.parse(response.body)
      expect(user['success']).to be true
    end

    it 'returns not found if user does not exist' do
      get '/api/v1/users/validation', params: { user: { email: 'not.found@user.com' } }, as: :json

      expect(response).to be_json_response(200)

      user = JSON.parse(response.body)
      expect(user['success']).to be false
    end
  end

  describe '/api/v1/users/:id' do
    it 'returns the user' do
      get "/api/v1/users/#{@user.id}", as: :json

      expect(response).to be_json_response

      user = JSON.parse(response.body)
      expect(user['data']['attributes']).not_to be_empty
      expect(user['data']['attributes']['pseudo']).to eq('Main User')
    end
  end

  describe '/api/v1/users/:id/comments' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/users/#{@user.id}/comments", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        create_list(:comment, 5, user: @user, commentable: @users.first)
      end

      it 'returns user comments' do
        get "/api/v1/users/#{@user.id}/comments", as: :json

        expect(response).to be_json_response

        comments = JSON.parse(response.body)
        expect(comments['data']).not_to be_empty
        expect(comments['data'].size).to eq(5)
      end
    end
  end

  describe '/api/v1/users/:id/recents' do
    context 'when user is not connected' do
      it 'returns recent articles for the visitor' do
        get "/api/v1/users/#{@user.id}/recents", as: :json

        expect(response).to be_json_response

        recents = JSON.parse(response.body)
        expect(recents['articles']).to be_empty
        expect(recents['tags']).to be_empty
      end
    end

    context 'when user is connected' do
      let(:tag) { create(:tag, user: @user) }

      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns user recents' do
        get "/api/v1/users/#{@user.id}/recents", as: :json

        expect(response).to be_json_response

        recents = JSON.parse(response.body)
        expect(recents['articles']).to be_empty
        expect(recents['tags']).to be_empty
      end
    end
  end

  context 'tracker' do
    describe '/api/v1/users/:id/clicked' do
      it 'counts a new click on tags' do
        post "/api/v1/users/#{@users.first.id}/clicked", as: :json

        expect(response).to be_json_response(204)
      end
    end

    describe '/api/v1/users/:id/viewed' do
      it 'counts a new view on tags' do
        post "/api/v1/users/#{@users.second.id}/viewed", as: :json

        expect(response).to be_json_response(204)
      end
    end
  end

end
