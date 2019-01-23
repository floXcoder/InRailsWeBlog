# frozen_string_literal: true

require 'rails_helper'

describe 'Topic API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic_name    = 'Public'
    @public_topic  = create(:topic, user: @user, name: @topic_name, visibility: 'everyone')
    @private_topic = create(:topic, user: @user, visibility: 'only_me')

    @other_topic_name = 'existing_topic'
    @other_topic      = create(:topic, user: @other_user, name: @other_topic_name)
  end

  let(:topic_attributes) {
    {
      topic: { name: 'name', description: 'description' }
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

  describe '/api/v1/topics' do
    context 'when not connected with no parameters' do
      it 'returns all public topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).not_to be_empty
        expect(json_topics['topics'].size).to eq(1)
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
        expect(json_topics['topics']).not_to be_empty
        expect(json_topics['topics'].size).to eq(3)
      end
    end

    context 'when filtering topics' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns bookmarked topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id, filter: { bookmarked: true } }, as: :json
        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).to be_empty
      end
    end

    context 'when fetching topics in database' do
      it 'limits the number of database queries' do
        expect {
          get '/api/v1/topics', params: { user_id: @user.id }, as: :json
        }.to make_database_queries(count: 1..3)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all topics for current user' do
        get '/api/v1/topics', params: { user_id: @user.id }, as: :json

        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).not_to be_empty
        expect(json_topics['topics'].size).to eq(1)
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

      it 'returns the new topic' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @public_topic.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['topic']).not_to be_empty
        expect(topic['topic']['name']).to eq(@public_topic.name)
      end

      it 'returns an error if not topic owner' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @other_topic.id }, as: :json

        expect(response).to be_json_response(403)

        topic = JSON.parse(response.body)
        expect(topic['errors']).not_to be_empty
      end
    end

    context 'when contributor is connected' do
      before do
        @contributed_user = create(:user)
        ::Shares::StoreService.new(@public_topic, @contributed_user.email, current_user: @user).perform
        login_as(@contributed_user, scope: :user, run_callbacks: false)
      end

      it 'returns the shared topic' do
        get '/api/v1/topics/switch', params: { user_id: @user.id, new_topic: @public_topic.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['topic']).not_to be_empty
        expect(topic['topic']['name']).to eq(@public_topic.name)
      end
    end
  end

  describe '/api/v1/topics/:id' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new topic' do
        get "/api/v1/topics/#{@public_topic.id}", params: { user_id: @user.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['topic']).not_to be_empty
        expect(topic['topic']['name']).to eq(@public_topic.name)
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
          expect(topic['topic']).not_to be_empty
          expect(topic['topic']['userId']).to eq(@user.id)
          expect(topic['topic']['name']).to eq(topic_attributes[:topic][:name])

          expect(@user.reload.current_topic_id).to eq(topic['topic']['id'])
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
          expect(topic['topic']).not_to be_empty
          expect(topic['topic']['userId']).to eq(@user.id)
          expect(topic['topic']['name']).to eq(@other_topic_name)
        }.to change(Topic, :count).by(1)
      end

      it 'returns an error if topic name is already used' do
        expect {
          post '/api/v1/topics', params: { user_id: @user.id, name: @topic_name }, as: :json

          expect(response).to be_json_response(422)

          article = JSON.parse(response.body)
          expect(article['errors']['name'].first).to eq(I18n.t('activerecord.errors.models.topic.already_exist'))
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

          article = JSON.parse(response.body)
          expect(article['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.topic_name_max_length))

          expect(@user.reload.current_topic_id).to eq(previous_topic_id)
        }.to_not change(Topic, :count)
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
          expect(topic['topic']).not_to be_empty
          expect(topic['topic']['name']).to eq(updated_topic_attributes[:topic][:name])
          expect(topic['topic']['description']).to eq(updated_topic_attributes[:topic][:description])
        }.to change(Topic, :count).by(0)
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
            expect(topic['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.topic_name_max_length))
          }.to change(Topic, :count).by(0)
        end
      end
    end
  end

  describe '/api/v1/topics/:id/share' do
    before do
      @contributed_user = create(:user)
    end

    context 'when user is not connected' do
      it 'returns an error message' do
        put "/api/v1/topics/#{@public_topic.id}/share", params: { login: @contributed_user.pseudo }, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the shared topic' do
        expect {
          put "/api/v1/topics/#{@public_topic.id}/share", params: { login: @contributed_user.pseudo }, as: :json

          expect(response).to be_json_response

          topic = JSON.parse(response.body)
          expect(topic['topic']).not_to be_empty
          expect(topic['topic']['contributors'].size).to eq(1)
          expect(topic['topic']['contributors'][0]['id']).to eq(@contributed_user.id)
        }.to change(Share, :count).by(1)

        expect(@public_topic.contributors).to match_array([@contributed_user])
        expect(@user.shared_topics).to match_array([@public_topic])
        expect(@contributed_user.contributed_topics).to match_array([@public_topic])
      end

      context 'when sharing a topic already shared' do
        before do
          ::Shares::StoreService.new(@public_topic, @contributed_user.email, current_user: @user).perform
        end

        it 'returns the errors' do
          expect {
            put "/api/v1/topics/#{@public_topic.id}/share", params: { login: @contributed_user.pseudo }, as: :json

            expect(response).to be_json_response(422)

            topic = JSON.parse(response.body)
            expect(topic['errors']).to eq(I18n.t('views.share.errors.already_shared'))
          }.to change(Share, :count).by(0)
        end
      end

      context 'when sharing a private topic' do
        it 'returns the errors' do
          expect {
            put "/api/v1/topics/#{@private_topic.id}/share", params: { login: @contributed_user.pseudo }, as: :json

            expect(response).to be_json_response(422)

            topic = JSON.parse(response.body)
            expect(topic['errors']).to eq(I18n.t('views.share.errors.private_shareable'))
          }.to change(Share, :count).by(0)
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
          expect(topic['topic']).not_to be_empty
        }.to change(Topic, :count).by(-1).and change(Article, :count).by(-@public_topic.articles.count).and change(TaggedArticle, :count).by(-@public_topic.tags.count).and change(TagRelationship, :count).by(0)
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
