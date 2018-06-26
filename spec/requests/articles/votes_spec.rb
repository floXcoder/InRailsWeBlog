require 'rails_helper'

describe 'History API', type: :request, basic: true do

  before(:all) do
    @user         = create(:user)
    @other_user   = create(:user)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
    @original_title = @article.title
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

        @article.update_attributes(title: 'title 2')
        @article.update_attributes(title: 'title 3')
      end

      it 'returns the article history' do
        get "/api/v1/articles/#{@article.id}/history", as: :json

        expect(response).to be_json_response
        json_history = JSON.parse(response.body)
        expect(json_history['history']).not_to be_empty
        expect(json_history['history'].size).to eq(2)
        articles_history = json_history['history'].map { |m| m['article']['title'] }
        expect(articles_history).to eq(['title 2', @original_title])
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
        expect(json_history['article']).not_to be_empty
        expect(json_history['article']['title']).to eq(@original_title)
      end
    end
  end

end
