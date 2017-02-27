describe 'User Bookmark API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic)
  end

  let(:bookmark_attributes) {
    {
      bookmark: { type: 'article', model_id: @article.id }
    }
  }

  describe '/users/:user_id/bookmarks (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post "/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the new bookmark' do
        expect {
          post "/users/#{@user.id}/bookmarks", params: bookmark_attributes, as: :json
        }.to change(Bookmark, :count).by(1)

        expect(response).to be_json_response(201)

        bookmark = JSON.parse(response.body)
        expect(bookmark['bookmark']).not_to be_empty
        expect(bookmark['bookmark']['bookmarked_type']).to eq('Article')
      end
    end
  end

  # describe '/users/:user_id/blog/articles (DELETE)' do
  #   context 'when user is not connected' do
  #     it 'returns an error message' do
  #       delete "/users/#{@user.id}/blog/articles/#{@articles.first.id}", as: :json
  #
  #       expect(response).to be_unauthenticated
  #     end
  #   end
  #
  #   context 'when user is connected' do
  #     before do
  #       login_as(@user, scope: :user, run_callbacks: false)
  #     end
  #
  #     it 'returns the deleted article id' do
  #       expect {
  #         delete "/users/#{@user.id}/blog/articles/#{@articles.first.id}", as: :json
  #       }.to change(Blog::Article, :count).by(-1)
  #
  #       expect(response).to be_json_response(202)
  #
  #       article = JSON.parse(response.body)
  #       expect(article['redirect_to']).not_to be_empty
  #     end
  #   end
  # end

end
