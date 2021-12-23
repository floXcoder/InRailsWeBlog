# frozen_string_literal: true

require 'rails_helper'

describe 'Context API', type: :request do

  before(:all) do
    @user            = create(:user)
    @public_tags     = create_list(:tag, 3, user: @user, visibility: :everyone)
    @private_tag     = create(:tag, user: @user, visibility: :only_me, name: 'private tag')
    @public_topic    = create(:topic, user: @user, visibility: :everyone, name: 'public topic')
    @private_topic   = create(:topic, user: @user, visibility: :only_me, name: 'private topic')
    @public_article  = create(:article, user: @user, topic: @public_topic, tags: [@public_tags[0], @public_tags[1]], visibility: :everyone, title: 'public article')
    @private_article = create(:article, user: @user, topic: @private_topic, tags: [@public_tags[0], @public_tags[1]], visibility: :only_me, title: 'private article')

    @other_user            = create(:user)
    @other_public_tags     = create_list(:tag, 3, user: @other_user, visibility: :everyone)
    @other_private_tag     = create(:tag, user: @other_user, visibility: :only_me, name: 'private tag')
    @other_public_topic    = create(:topic, user: @other_user, visibility: :everyone, name: 'public')
    @other_private_topic   = create(:topic, user: @other_user, visibility: :only_me, name: 'private')
    @other_public_article  = create(:article, user: @other_user, topic: @other_public_topic, tags: [@other_public_tags[0], @other_public_tags[1]], visibility: :everyone, title: 'public article')
    @other_private_article = create(:article, user: @other_user, topic: @other_private_topic, tags: [@other_public_tags[0], @other_public_tags[1]], visibility: :only_me, title: 'private article')
  end

  describe '/api/v1/articles/:id' do
    context 'when user is not connected' do
      it 'can access to the public articles of each user' do
        get "/api/v1/articles/#{@public_article.slug}", params: { user_id: @public_article.user.slug }, as: :json
        expect(response).to be_json_response
        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['id']).to eq(@public_article.id)

        get "/api/v1/articles/#{@other_public_article.slug}", params: { user_id: @other_public_article.user.slug }, as: :json
        expect(response).to be_json_response
        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['id']).to eq(@other_public_article.id)
      end
    end

    context 'when other user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'cannot access to private article of user' do
        get "/api/v1/articles/#{@private_article.slug}", params: { user_id: @private_article.user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end
  end

  describe '/api/v1/articles/:id/stories' do
    context 'when user is not connected' do
      it 'can access to the public articles of each user' do
        get "/api/v1/articles/#{@public_article.slug}", params: { user_id: @public_article.user.slug }, as: :json
        expect(response).to be_json_response
        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['id']).to eq(@public_article.id)

        get "/api/v1/articles/#{@other_public_article.slug}", params: { user_id: @other_public_article.user.slug }, as: :json
        expect(response).to be_json_response
        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['id']).to eq(@other_public_article.id)
      end
    end

    context 'when other user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'cannot access to private article of user' do
        get "/api/v1/articles/#{@private_article.slug}", params: { user_id: @private_article.user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end
  end

  describe '/api/v1/topics/:id' do
    context 'when user is not connected' do
      it 'can access to the public topics of each user' do
        get "/api/v1/topics/#{@public_topic.slug}", params: { user_id: @public_topic.user.slug }, as: :json
        expect(response).to be_json_response
        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['id']).to eq(@public_topic.id)

        get "/api/v1/topics/#{@other_public_topic.slug}", params: { user_id: @other_public_topic.user.slug }, as: :json
        expect(response).to be_json_response
        topic = JSON.parse(response.body)
        expect(topic['data']['attributes']).not_to be_empty
        expect(topic['data']['attributes']['id']).to eq(@other_public_topic.id)
      end
    end

    context 'when other user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'cannot access to private tag of user' do
        get "/api/v1/tags/#{@private_tag.slug}", params: { user_id: @private_article.user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end
  end

  describe '/api/v1/tags/:id' do
    context 'when user is not connected' do
      it 'can access to the public tags of each user' do
        get "/api/v1/tags/#{@public_tags[0].slug}", params: { user_id: @public_tags[0].user.slug }, as: :json
        expect(response).to be_json_response
        tag = JSON.parse(response.body)
        expect(tag['data']['attributes']).not_to be_empty
        expect(tag['data']['attributes']['id']).to eq(@public_tags[0].id)

        get "/api/v1/tags/#{@other_public_tags[0].slug}", params: { user_id: @other_public_tags[0].user.slug }, as: :json
        expect(response).to be_json_response
        tag = JSON.parse(response.body)
        expect(tag['data']['attributes']).not_to be_empty
        expect(tag['data']['attributes']['id']).to eq(@other_public_tags[0].id)
      end
    end

    context 'when other user is connected' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'cannot access to private tag of user' do
        get "/api/v1/tags/#{@private_tag.slug}", params: { user_id: @private_tag.user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end
  end

end
