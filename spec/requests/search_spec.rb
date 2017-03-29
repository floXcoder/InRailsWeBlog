require 'rails_helper'

describe 'Search API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @tags = create_list(:tag, 5, user: @user)
    @articles = create_list(:article, 5, user: @user, topic: @topic)

    Article.reindex
    Tag.reindex
    Article.search_index.refresh
    Tag.search_index.refresh
  end

  describe '/search' do
    context 'when no parameters' do
      it 'returns all results' do
        get '/search', as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results).not_to be_empty
      end
    end

    context 'when query is set' do
      it 'returns results containing the query for article' do
        get '/search', params: { search: { query: 'a' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results).not_to be_empty
      end
    end
  end

  describe '/search/autocomplete' do
    context 'when no parameters' do
      it 'returns an empty set of autocompletion' do
        get '/search/autocomplete', as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        # expect(results['articles']).not_to be_empty
      end
    end

    context 'when query is set' do
      it 'returns the autocompletion result' do
        get '/search/autocomplete', params: { search: { query: 'ar' } }, as: :json

        expect(response).to be_json_response

        results = JSON.parse(response.body)

        expect(results['articles']).not_to be_empty
      end
    end
  end

end
