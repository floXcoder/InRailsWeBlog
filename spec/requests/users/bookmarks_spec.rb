require 'rails_helper'

describe 'User Bookmarks API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @tag     = create(:tag, user: @user)
    @article = create(:article, user: @user, topic: @topic)

    @tag_bookmark = create(:bookmark, user: @user, bookmarked: @tag)
  end

  let(:bookmark_attributes) {
    {
      bookmark: { model_type: 'article', model_id: @article.id }
    }
  }

  describe '/users/:user_id/bookmarks (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          post "/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json

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
          post "/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json

          expect(response).to be_json_response(201)

          bookmark = JSON.parse(response.body)
          expect(bookmark['bookmark']).not_to be_empty
          expect(bookmark['bookmark']['bookmarkedType']).to eq('Article')
        }.to change(Bookmark, :count).by(1)
      end
    end
  end

  describe '/users/:user_id/bookmarks (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        expect {
          delete "/users/#{@user.id}/bookmarks/#{@tag_bookmark.id}", as: :json

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
          delete "/users/#{@user.id}/bookmarks/#{@tag_bookmark.id}", params: { bookmark: { model_type: 'tag', model_id: @tag.id } }, as: :json

          expect(response).to be_json_response(204)
        }.to change(Bookmark, :count).by(-1)
      end
    end
  end

end
