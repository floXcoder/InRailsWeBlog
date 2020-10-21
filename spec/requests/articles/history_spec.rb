# frozen_string_literal: true

require 'rails_helper'

describe 'History API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)

    @article.update(title: 'title 2')
    @article.update(title: 'title 3')
  end

  describe '/api/v1/articles/:id/history' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/articles/#{@article.id}/history", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the article history' do
        get "/api/v1/articles/#{@article.id}/history", as: :json

        expect(response).to be_json_response
        json_history = JSON.parse(response.body)

        expect(json_history['meta']['root']).to eq('history')
        expect(json_history['data']).not_to be_empty
        expect(json_history['data'].size).to eq(2)
        article_titles_history = json_history['data'].map { |m| m['attributes']['article']['title'] }
        expect(article_titles_history).to eq(['title 3', 'title 2'])

        last_changeset = json_history['data'].first['attributes']
        expect(last_changeset['changeset']['title_translations'].size).to eq(2)
      end
    end
  end

  describe '/api/v1/articles/:id/restore' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/articles/#{@article.id}/restore", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns not found if no history given' do
        get "/api/v1/articles/#{@article.id}/restore", as: :json

        expect(response).to be_json_response(404)
        json_history = JSON.parse(response.body)
        expect(json_history).to be_empty
      end

      it 'returns the restored article' do
        get "/api/v1/articles/#{@article.id}/restore", params: { version_id: PaperTrail::Version.last.id }, as: :json

        expect(response).to be_json_response(202)
        json_history = JSON.parse(response.body)
        expect(json_history['data']['attributes']).not_to be_empty
        expect(json_history['data']['attributes']['title']).to eq('title 3')
      end
    end
  end

end
