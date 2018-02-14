require 'rails_helper'

describe 'Search API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @tags = create_list(:tag, 5, user: @user, visibility: 'everyone') # Tags are generated with "tag" in name
    @articles = create_list(:article, 5, user: @user, topic: @topic, title: 'article name', visibility: 'everyone')

    Article.reindex
    Tag.reindex
    Article.search_index.refresh
    Tag.search_index.refresh
  end

  describe '/api/v1/search' do
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
        expect(results['articles'].size).to eq(5)
        expect(results['totalCount']['articles']).to eq(5)
        expect(results['totalPages']['articles']).to eq(1)
      end
    end
  end

  describe '/api/v1/search/autocomplete' do
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
  end

end
