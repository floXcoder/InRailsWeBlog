require 'rails_helper'

describe 'Users API', type: :request, basic: true do

  before(:all) do
    @admin = create(:admin)
    @user  = create(:user, pseudo: 'Main User')
    @users = create_list(:user, 5)
  end

  describe '/users (HTML)' do
    it 'returns the page' do
      get '/users'

      expect(response).to be_html_response
      expect(response.body).to match('id="user-index-component"')
    end
  end

  describe '/users' do
    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all users' do
        get '/users', as: :json

        expect(response).to be_json_response

        users = JSON.parse(response.body)
        expect(users['users']).not_to be_empty
        # expect(users['users'].size).to eq(6)
      end

      it 'limits the number of users' do
        create_list(:user, 10)

        get '/users', as: :json

        users = JSON.parse(response.body)
        expect(users['users']).not_to be_empty
        expect(users['users'].size).to be <= Setting.per_page
      end
    end
  end

  describe '/users/validation' do
    it 'returns true if user exists' do
      get '/users/validation', params: { user: { pseudo: 'Main User' } }, as: :json

      expect(response).to be_json_response(200)

      user = JSON.parse(response.body)
      expect(user['success']).to be true
    end

    it 'returns not found if user does not exist' do
      get '/users/validation', params: { user: { email: 'not.found@user.com' } }, as: :json

      expect(response).to be_json_response(200)

      user = JSON.parse(response.body)
      expect(user['success']).to be false
    end
  end

  # describe '/users/:id (HTML)' do
  #   it 'returns the page' do
  #     get "/users/#{@user.id}"
  #
  #     expect(response).to be_html_response
  #     expect(response.body).to match('id="user-show-component"')
  #   end
  # end

  describe '/users/:id' do
    it 'returns the user' do
      get "/users/#{@user.id}", as: :json

      expect(response).to be_json_response

      user = JSON.parse(response.body)
      expect(user['user']).not_to be_empty
      expect(user['user']['pseudo']).to eq('Main User')
    end

  # TODO: test user complete
  # TODO: test user profile
  end

  # TODO: test user bookmarks show
  # describe '/users/:id/bookmarks (HTML)' do
  #   before do
  #     login_as(@user, scope: :admin, run_callbacks: false)
  #   end
  #
  #   it 'returns the page' do
  #     get "/users/#{@user.id}/bookmarks"
  #
  #     expect(response).to be_html_response
  #     expect(response.body).to match('id="user-bookmarks-component"')
  #   end
  # end

  describe '/users/:id/comments' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/users/#{@user.id}/comments", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        create_list(:comment, 5, user: @user, commentable: @users.first)
      end

      it 'returns user comments' do
        get "/users/#{@user.id}/comments", as: :json

        expect(response).to be_json_response

        comments = JSON.parse(response.body)
        expect(comments['comments']).not_to be_empty
        expect(comments['comments'].size).to eq(5)
      end
    end
  end

  # TODO: test user recents

  describe '/users/:id/activities' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/users/#{@user.id}/activities", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns user activities' do
        get "/users/#{@user.id}/activities", as: :json

        expect(response).to be_json_response

        activities = JSON.parse(response.body)
        expect(activities['activities']).not_to be_empty
      end
    end
  end

  # describe '/users/:id/edit (HTML)' do
  #   before do
  #     login_as(@user, scope: :admin, run_callbacks: false)
  #   end
  #
  #   it 'returns the page' do
  #     get "/users/#{@user.id}/edit"
  #
  #     expect(response).to be_html_response
  #     expect(response.body).to match('div class="card user-edit"')
  #   end
  # end

  context 'tracker' do
    describe '/users/:id/clicked' do
      it 'counts a new click on tags' do
        post "/users/#{@users.first.id}/clicked", as: :json

        expect(response).to be_json_response(204)
      end
    end

    describe '/users/:id/viewed' do
      it 'counts a new view on tags' do
        post "/users/#{@users.second.id}/viewed", as: :json

        expect(response).to be_json_response(204)
      end
    end
  end

end
