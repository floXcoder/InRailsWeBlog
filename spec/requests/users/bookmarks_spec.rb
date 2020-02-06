# frozen_string_literal: true

require 'rails_helper'

describe 'User Bookmarks API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @tag     = create(:tag, user: @user)
    @article = create(:article, user: @user, topic: @topic)

    @article_to_bookmark = create(:article, user: @user, topic: @topic)

    @article_bookmark = create(:bookmark, user: @user, bookmarked: @article, topic: @topic)

    @other_topic            = create(:topic, user: @user)
    @other_article          = create(:article, user: @user, topic: @other_topic)
    @other_article_bookmark = create(:bookmark, user: @user, bookmarked: @other_article, topic: @other_topic)
  end

  let(:bookmark_attributes) {
    {
      bookmark: { bookmarked_type: 'article', bookmarked_id: @article_to_bookmark.id }
    }
  }

  describe '/api/v1/users/:user_id/bookmarks' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/api/v1/users/#{@user.id}/bookmarks", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all bookmarks' do
        get "/api/v1/users/#{@user.id}/bookmarks", as: :json

        expect(response).to be_json_response

        bookmarks = JSON.parse(response.body)
        expect(bookmarks['meta']['root']).to eq('bookmarks')
        expect(bookmarks['data']).not_to be_empty
        expect(bookmarks['data'].size).to eq(2)
      end

      it 'returns all bookmarks for a given topic' do
        get "/api/v1/users/#{@user.id}/bookmarks", params: { topic_id: @topic.id }, as: :json

        expect(response).to be_json_response

        bookmarks = JSON.parse(response.body)
        expect(bookmarks['meta']['root']).to eq('bookmarks')
        expect(bookmarks['data']).not_to be_empty
        expect(bookmarks['data'].size).to eq(1)
      end
    end
  end

  describe '/api/v1/users/:user_id/bookmarks (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          post "/api/v1/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json

          expect(response).to be_unauthenticated
        }.not_to change(Bookmark, :count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new bookmark' do
        expect {
          post "/api/v1/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json

          expect(response).to be_json_response(201)

          bookmark = JSON.parse(response.body)
          expect(bookmark['data']).not_to be_empty
          expect(bookmark['data']['attributes']['bookmarkedType']).to eq('Article')
        }.to change(Bookmark, :count).by(1)
      end
    end
  end

  describe '/api/v1/users/:user_id/bookmarks (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          delete "/api/v1/users/#{@user.id}/bookmarks/#{@article_bookmark.id}", as: :json

          expect(response).to be_unauthenticated
        }.not_to change(Bookmark, :count)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the deleted bookmark id' do
        expect {
          delete "/api/v1/users/#{@user.id}/bookmarks/#{@article_bookmark.id}", as: :json, params: { bookmark: { bookmarked_type: 'article', bookmarked_id: @article.id } }

          expect(response).to be_json_response(204)
        }.to change(Bookmark, :count).by(-1)
      end
    end
  end

end
