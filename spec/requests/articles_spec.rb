describe 'Article API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @articles = create_list(:article, 3, user: @user, topic: @topic)
    @tags     = create_list(:tag, 5, user: @user, topic: @topic)
    @tags.each do |tag|
      create(:tagged_article, article: @articles.first, tag: tag)
    end

    @private_article = create(:article, user: @user, topic: @topic, visibility: 'only_me')
  end

  let(:article_attributes) {
    {
      blog: { title: 'title', summary: 'summary', content: 'content', tags: %w(tag1 tag2) }
    }
  }
  let(:updated_article_attributes) {
    {
      blog: { title: 'updated title', tags: ['tag1'] }
    }
  }

  describe '/articles/:id' do
    context 'when user is not connected and article is private' do
      it 'returns an error message' do
        get "/articles/#{@private_article.id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected and article is private' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the associated article' do
        get "/articles/#{@private_article.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
      end
    end

    context 'when article is public' do
      it 'returns the associated article' do
        get "/articles/#{@articles.first.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        # expect(article['article']['title']).to eq('Article title 1')
        # expect(article['article']['tags'].size).to eq(5)
      end
    end
  end

  describe '/articles (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post '/articles', params: article_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new article' do
        expect {
          post '/articles', params: article_attributes, as: :json
        }.to change(Article, :count).by(1)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(article_attributes[:blog][:title])
        expect(article['article']['tags'].size).to eq(2)
      end
    end
  end

  describe '/articles (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/articles/#{@articles.first.id}", params: article_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated article' do
        put "/articles/#{@articles.first.id}", params: updated_article_attributes, as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(updated_article_attributes[:blog][:title])
        expect(article['article']['tags'].size).to eq(1)
      end
    end
  end

  describe '/articles (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/articles/#{@articles.first.id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the deleted article id' do
        expect {
          delete "/articles/#{@articles.first.id}", as: :json
        }.to change(Article, :count).by(-1)

        expect(response).to be_json_response(202)

        article = JSON.parse(response.body)
        expect(article['redirect_to']).not_to be_empty
      end
    end
  end

end
