# frozen_string_literal: true

require 'rails_helper'

describe 'Search API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user) # Create a default topic
    @topic = create(:topic, user: @user, visibility: :everyone)

    @tags     = create_list(:tag, 5, user: @user, visibility: :everyone) # Tags are generated with "tag" in name
    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'article name', visibility: :everyone, tags: [@tags[0]])

    @private_article = create(:article, user: @user, topic: @topic, title: 'article private name', visibility: :only_me, tags: [@tags[1]])

    @second_private_topic   = create(:topic, user: @user, visibility: :only_me)
    @second_private_article = create(:article, user: @user, topic: @second_private_topic, title: 'article private second name', visibility: :only_me, draft: true)

    @other_user            = create(:user)
    @other_topic           = create(:topic, user: @other_user)
    @other_tag             = create(:tag, user: @other_user, visibility: :everyone)
    @other_public_article  = create(:article, user: @other_user, topic: @other_topic, title: 'article public other name', visibility: :everyone, tags: [@other_tag])
    @other_private_article = create(:article, user: @other_user, topic: @other_topic, title: 'article private other name', visibility: :only_me, tags: [@other_tag])

    Article.reindex
    Article.search_index.refresh
    Topic.reindex
    Topic.search_index.refresh
    Tag.reindex
    Tag.search_index.refresh
  end

  describe '/api/v1/search', search: true do
    context 'when no parameters' do
      it 'returns all results' do
        get '/api/v1/search', as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results).not_to be_empty
        expect(results['articles'].size).to be >= 5
        expect(results['tags'].size).to be >= 5
      end
    end

    context 'when query is set' do
      it 'returns results containing the query for articles' do
        get '/api/v1/search', params: { search: { query: 'article' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results['articles'].size).to eq(6)
        expect(results['totalCount']['articles']).to eq(6)
        expect(results['totalPages']['articles']).to eq(1)
      end
    end

    context 'when mixed public and private articles' do
      it 'returns public articles only when not connected' do
        get '/api/v1/search', params: { search: { query: 'article' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results['articles'].size).to eq(6)
        expect(results['totalCount']['articles']).to eq(6)
      end

      it 'returns public articles for a specific topic only when not connected' do
        get '/api/v1/search', params: { search: { query: 'article', topic_id: @topic.id } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results['articles'].size).to eq(5)
        expect(results['totalCount']['articles']).to eq(5)
      end

      it 'returns all articles only when connected' do
        login_as(@user, scope: :user, run_callbacks: false)

        get '/api/v1/search', params: { search: { query: 'article' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results['articles'].size).to eq(8)
        expect(results['totalCount']['articles']).to eq(8)
      end
    end
  end

  describe '/api/v1/search/autocomplete', search: true do
    context 'when no parameters' do
      it 'returns an empty set of autocompletion' do
        get '/api/v1/search/autocomplete', as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results).to be_empty
      end
    end

    context 'when query is set' do
      it 'returns the autocompletion result for articles' do
        get '/api/v1/search/autocomplete', params: { search: { query: 'art' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results['articles']).not_to be_empty
        expect(results['articles'].size).to be > 1
      end

      it 'returns the autocompletion result for tags' do
        get '/api/v1/search/autocomplete', params: { search: { query: 'ta' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results['tags']).not_to be_empty
        expect(results['tags'].size).to be > 1
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the autocompletion result for articles' do
        get '/api/v1/search/autocomplete', params: { search: { query: '*' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)
        expect(results['articles']).not_to be_empty
        expect(results['articles'].size).to eq(Article.everyone_and_user(@user.id).count)
      end
    end
  end

end
