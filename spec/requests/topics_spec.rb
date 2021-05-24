# frozen_string_literal: true

require 'rails_helper'

describe 'Topic API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic_name          = 'Public'
    @public_topic        = create(:topic, user: @user, name: @topic_name, visibility: :everyone)
    @private_topic       = create(:topic, user: @user, visibility: :only_me)
    @other_private_topic = create(:topic, user: @user, visibility: :only_me)

    @other_topic_name = 'existing_topic'
    @other_topic      = create(:topic, user: @other_user, name: @other_topic_name)
  end

  let(:topic_attributes) {
    {
      topic: { name: 'name', description: 'description' }
    }
  }
  let(:topic_stories_attributes) {
    {
      topic: { mode: 'stories', name: 'name stories', description: 'description stories' }
    }
  }
  let(:topic_inventory_attributes) {
    {
      topic: { mode: 'inventories', name: 'name inventories', description: 'description inventories' }
    }
  }
  let(:updated_topic_attributes) {
    {
      topic: { name: 'name title', description: 'new description' }
    }
  }
  let(:topic_error_attributes) {
    {
      topic: topic_attributes.merge(
        name: 'name' * 60
      )
    }
  }

  describe '/topics/:id (HTML)' do
    it 'returns the public topic' do
      get "/users/#{@user.slug}/topics/#{@public_topic.slug}/show"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('data-topic="{')
    end
  end

  describe '/api/v1/topics' do
    context 'when not connected with no parameters' do
      it 'returns all public topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        json_topics = JSON.parse(response.body)
        expect(json_topics['meta']['root']).to eq('topics')
        expect(json_topics['data']).not_to be_empty
        expect(json_topics['data'].size).to eq(1)
      end
    end

    context 'when owner is connected with no parameters' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public and private topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        json_topics = JSON.parse(response.body)
        expect(json_topics['meta']['root']).to eq('topics')
        expect(json_topics['data']).not_to be_empty
        expect(json_topics['data'].size).to eq(@user.topics.count)
      end
    end

    context 'when filtering topics' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns bookmarked topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id, filter: { bookmarked: true } }, as: :json
        json_topics = JSON.parse(response.body)
        expect(json_topics['meta']['root']).to eq('topics')
        expect(json_topics['data']).to be_empty
      end
    end

    context 'when fetching topics in database' do
      it 'limits the number of database queries' do
        expect {
          get '/api/v1/topics', params: { user_id: @user.id }, as: :json
        }.to make_database_queries(count: 5..8)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id }, as: :json

        json_topics = JSON.parse(response.body)
        expect(json_topics['meta']['root']).to eq('topics')
        expect(json_topics['data']).not_to be_empty
        expect(json_topics['data'].size).to eq(1)
      end
    end
  end

  describe '/api/v1/topics/switch' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get '/api/v1/topics/switch', params: { user_id: @user.id }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @public_topic.id }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new topic for slug' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @public_topic.slug }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['name']).to eq(@public_topic.name)
      end

      it 'returns an error if not topic owner' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @other_topic.slug }, as: :json

        expect(response).to be_json_response(403)

        topic = JSON.parse(response.body)
        expect(topic['errors']).not_to be_empty
      end
    end

    context 'when contributor is connected' do
      before do
        @contributed_user = create(:user)
        ::Shares::StoreService.new(@public_topic, login: @contributed_user.email, current_user: @user).perform
        login_as(@contributed_user, scope: :user, run_callbacks: false)
      end

      it 'returns the shared topic' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @public_topic.slug }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['name']).to eq(@public_topic.name)
      end
    end
  end

  describe '/api/v1/topics/:id' do
    context 'when user is not connected' do
      it 'returns the topic' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['name']).to eq(@public_topic.name)
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns the topic' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['name']).to eq(@public_topic.name)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the topic' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['name']).to eq(@public_topic.name)
      end
    end
  end

  describe '/api/v1/topics (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post '/api/v1/topics', params: topic_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new topic and switch to this topic' do
        expect {
          post '/api/v1/topics', params: topic_attributes.merge(user_id: @user.id), as: :json

          expect(response).to be_json_response(201)

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['attributes']['userId']).to eq(@user.id)
          expect(topic['data']['attributes']['name']).to eq(topic_attributes[:topic][:name])

          expect(@user.reload.current_topic_id).to eq(topic['data']['attributes']['id'])
        }.to change(Topic, :count).by(1)
      end

      it 'returns a new story topic' do
        expect {
          post '/api/v1/topics', params: topic_stories_attributes.merge(user_id: @user.id), as: :json

          expect(response).to be_json_response(201)

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['attributes']['mode']).to eq('stories')
          expect(topic['data']['attributes']['userId']).to eq(@user.id)
          expect(topic['data']['attributes']['name']).to eq(topic_stories_attributes[:topic][:name])

          expect(@user.reload.current_topic_id).to eq(topic['data']['attributes']['id'])
        }.to change(Topic, :count).by(1)
      end

      it 'returns a new inventory topic' do
        expect {
          post '/api/v1/topics', params: topic_inventory_attributes.merge(user_id: @user.id), as: :json

          expect(response).to be_json_response(201)

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['attributes']['mode']).to eq('inventories')
          expect(topic['data']['attributes']['userId']).to eq(@user.id)
          expect(topic['data']['attributes']['name']).to eq(topic_inventory_attributes[:topic][:name])

          expect(@user.reload.current_topic_id).to eq(topic['data']['attributes']['id'])
        }.to change(Topic, :count).by(1)
      end
    end

    context 'when creating another topic' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new topic even if the name is used by another user' do
        expect {
          post '/api/v1/topics', params: { user_id: @user.id, name: @other_topic_name }, as: :json

          expect(response).to be_json_response(201)

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['attributes']['userId']).to eq(@user.id)
          expect(topic['data']['attributes']['name']).to eq(@other_topic_name)
        }.to change(Topic, :count).by(1)
      end

      it 'returns an error if topic name is already used' do
        expect {
          post '/api/v1/topics', params: { user_id: @user.id, name: @topic_name }, as: :json

          expect(response).to be_json_response(422)

          topic = JSON.parse(response.body)
          expect(topic['errors']['name'].first).to eq(I18n.t('activerecord.errors.models.topic.already_exist'))
        }.not_to change(Topic, :count)
      end
    end

    context 'when creating a topic with errors' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the errors and stay on the same topic' do
        previous_topic_id = @user.reload.current_topic_id

        expect {
          post '/api/v1/topics', params: topic_error_attributes.merge(user_id: @user.id), as: :json

          expect(response).to be_json_response(422)

          topic = JSON.parse(response.body)
          expect(topic['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: InRailsWeBlog.config.topic_name_max_length))

          expect(@user.reload.current_topic_id).to eq(previous_topic_id)
        }.not_to change(Topic, :count)
      end
    end
  end

  describe '/api/v1/topics (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/api/v1/topics/#{@public_topic.id}", params: updated_topic_attributes.merge(user_id: @user.id), as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated topic' do
        expect {
          put "/api/v1/topics/#{@public_topic.id}", params: updated_topic_attributes.merge(user_id: @user.id), as: :json

          expect(response).to be_json_response

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
          expect(topic['data']['attributes']['name']).to eq(updated_topic_attributes[:topic][:name])
          expect(topic['data']['attributes']['description']).to eq(updated_topic_attributes[:topic][:description])
        }.not_to change(Topic, :count)
      end

      context 'when updating a topic with errors' do
        before do
          login_as(@user, scope: :user, run_callbacks: false)
        end

        it 'returns the errors' do
          expect {
            put "/api/v1/topics/#{@public_topic.id}", params: topic_error_attributes.merge(user_id: @user.id), as: :json

            expect(response).to be_json_response(422)

            topic = JSON.parse(response.body)
            expect(topic['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: InRailsWeBlog.config.topic_name_max_length))
          }.not_to change(Topic, :count)
        end
      end
    end
  end

  describe '/api/v1/topics/:id (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/api/v1/topics/#{@public_topic.id}", as: :json, params: { user_id: @user.id }

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        create_list(:article, 5, user: @user, topic: @public_topic)
      end

      it 'returns the soft deleted topic id' do
        expect {
          delete "/api/v1/topics/#{@public_topic.id}", as: :json, params: { user_id: @user.id }

          expect(response).to be_json_response

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
        }.to change(Topic, :count).by(-1).and change(Article, :count).by(-@public_topic.articles.count).and change(TaggedArticle, :count).by(-@public_topic.tags.count).and change(TagRelationship, :count).by(0)
      end

      it 'deletes the current user topic' do
        @user.switch_topic(@other_private_topic)

        expect {
          delete "/api/v1/topics/#{@other_private_topic.id}", as: :json, params: { user_id: @user.id }

          expect(response).to be_json_response

          topic = JSON.parse(response.body)
          expect(topic['data']['attributes']).not_to be_empty
        }.to change(Topic, :count).by(-1).and change(Article, :count).by(0).and change(TaggedArticle, :count).by(0).and change(TagRelationship, :count).by(0)
      end
    end
  end

  context 'tracker' do
    describe '/api/v1/tags/:id/clicked' do
      it 'counts a new click on tags' do
        post "/api/v1/tags/#{@public_topic.id}/clicked", params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response(204)
      end
    end

    describe '/api/v1/tags/:id/viewed' do
      it 'counts a new view on tags' do
        post "/api/v1/tags/#{@private_topic.id}/viewed", as: :json

        expect(response).to be_json_response(204)
      end
    end
  end

end
