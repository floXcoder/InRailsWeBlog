require 'rails_helper'

describe 'Activities API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @admin = create(:admin)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, title: 'Article name')

    @article.create_activity(:update, owner: @user)
    @article.create_activity(:update, owner: @user)
    @article.create_activity(:update, owner: @user)

    @other_user = create(:user)
    @other_tag  = create(:tag, user: @other_user, visibility: 'only_me')
    @other_topic = create(:topic, user: @other_user)
  end

  describe '/api/v1/activities' do
    context 'when admin is not connected' do
      it 'returns an error message' do
        get '/api/v1/activities', as: :json

        expect(response).to be_json_response(404)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns last activities' do
        get '/api/v1/activities', as: :json

        expect(response).to be_json_response

        activities = JSON.parse(response.body)

        expect(activities).not_to be_empty
        expect(activities.first['key']).to eq('topic.create')
      end
    end

    context 'when a specific user has custom activities' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)

        post "/api/v1/users/#{@other_user.id}/bookmarks", params: { bookmark: { bookmarked_model: 'article', bookmarked_id: @article.id } }, as: :json
        post "/api/v1/articles/#{@article.id}/votes", as: :json
        post "/api/v1/articles/#{@article.id}/outdated", as: :json
        post "/api/v1/articles/#{@article.id}/comments", params: { comment: { title: 'title', body: 'The comment' } }, as: :json
        put "/api/v1/tags/#{@other_tag.id}", params: { tag: { name: 'second title' } }, as: :json
        post '/api/v1/topics', params: { user_id: @other_user.id, topic: { name: 'name', description: 'description' } }, as: :json
        put "/api/v1/topics/#{@other_topic.id}", params: { user_id: @other_user.id, topic: { name: 'second name' } }, as: :json

        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all user activities' do
        get '/api/v1/activities', params: { user_id: @other_user.id }, as: :json

        expect(response).to be_json_response

        activities = JSON.parse(response.body)

        expect(activities).to all(include('owner_type' => 'User', 'owner_id' => @other_user.id))

        expect(activities).to include(include('trackable_type' => 'Article', 'key' => 'article.bookmarked'))
        expect(activities).to include(include('trackable_type' => 'Article', 'key' => 'article.vote_up'))
        expect(activities).to include(include('trackable_type' => 'Article', 'key' => 'article.outdated_up'))
        expect(activities).to include(include('trackable_type' => 'Article', 'key' => 'article.commented_on'))
        expect(activities).to include(include('trackable_type' => 'Tag', 'key' => 'tag.update'))
        expect(activities).to include(include('trackable_type' => 'Topic', 'key' => 'topic.create'))
        expect(activities).to include(include('trackable_type' => 'Topic', 'key' => 'topic.update'))
      end
    end
  end

end
