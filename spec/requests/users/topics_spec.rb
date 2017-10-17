require 'rails_helper'

describe 'User Topic API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @first_topic  = create(:topic, user: @user)
    @second_topic = create(:topic, user: @user, visibility: 'only_me')

    @other_topic = create(:topic, user: @other_user)
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

  describe '/users/:user_id/topics' do
    context 'when not connected with no parameters' do
      it 'returns all public topics for current user' do
        get "/users/#{@user.id}/topics", as: :json

        expect(response).to be_json_response

        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).not_to be_empty
        expect(json_topics['topics'].size).to eq(2)
      end
    end

    context 'when owner is connected with no parameters' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public and private topics for current user' do
        get "/users/#{@user.id}/topics", as: :json

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
        get "/users/#{@user.id}/topics", params: { filter: { bookmarked: true } }, as: :json
        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).to be_empty
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all topics for current user' do
        get "/users/#{@user.id}/topics", as: :json

        json_topics = JSON.parse(response.body)
        expect(json_topics['topics']).not_to be_empty
        expect(json_topics['topics'].size).to eq(2)
      end
    end
  end

  describe '/users/:user_id/topics/switch' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/users/#{@user.id}/topics/switch", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        post "/users/#{@user.id}/topics/switch", params: { new_topic_id: @first_topic.id }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new topic' do
        post "/users/#{@user.id}/topics/switch", params: { new_topic_id: @first_topic.id }, as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['topic']).not_to be_empty
        expect(topic['topic']['name']).to eq(@first_topic.name)
      end
    end
  end

  describe '/users/:user_id/topics/:id' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/users/#{@user.id}/topics/#{@first_topic.id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when another user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/users/#{@user.id}/topics/#{@first_topic.id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new topic' do
        get "/users/#{@user.id}/topics/#{@first_topic.id}", as: :json

        expect(response).to be_json_response

        topic = JSON.parse(response.body)
        expect(topic['topic']).not_to be_empty
        expect(topic['topic']['name']).to eq(@first_topic.name)
      end
    end
  end

  describe '/users/:user_id/topics (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/users/#{@user.id}/topics", params: topic_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new topic and switch to this topic' do
        expect {
          post "/users/#{@user.id}/topics", params: topic_attributes, as: :json

          expect(response).to be_json_response(201)

          topic = JSON.parse(response.body)
          expect(topic['topic']).not_to be_empty
          expect(topic['topic']['userId']).to eq(@user.id)
          expect(topic['topic']['name']).to eq(topic_attributes[:topic][:name])

          expect(@user.reload.current_topic_id).to eq(topic['topic']['id'])
        }.to change(Topic, :count).by(1)
      end
    end

    context 'when creating a topic with errors' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the errors and stay on the same topic' do
        previous_topic_id = @user.reload.current_topic_id

        expect {
          post "/users/#{@user.id}/topics", params: topic_error_attributes, as: :json

          expect(response).to be_json_response(403)

          article = JSON.parse(response.body)
          expect(article['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.topic_name_max_length))

          expect(@user.reload.current_topic_id).to eq(previous_topic_id)
        }.to_not change(Topic, :count)
      end
    end
  end

  describe '/users/:user_id/topics (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/users/#{@user.id}/topics/#{@first_topic.id}", params: updated_topic_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated topic' do
        expect {
          put "/users/#{@user.id}/topics/#{@first_topic.id}", params: updated_topic_attributes, as: :json

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
            put "/users/#{@user.id}/topics/#{@first_topic.id}", params: topic_error_attributes, as: :json

            expect(response).to be_json_response(403)

            topic = JSON.parse(response.body)
            expect(topic['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.topic_name_max_length))
          }.to change(Topic, :count).by(0)
        end
      end
    end
  end

  describe '/topics/:id (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/users/#{@user.id}/topics/#{@first_topic.id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        create_list(:article, 5, user: @user, topic: @first_topic)
      end

      it 'returns the soft deleted topic id' do
        expect {
          delete "/users/#{@user.id}/topics/#{@first_topic.id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Topic, :count).by(-1).and change(Article, :count).by(-5).and change(TaggedArticle, :count).by(0).and change(TagRelationship, :count).by(0)
      end
    end
  end

end
