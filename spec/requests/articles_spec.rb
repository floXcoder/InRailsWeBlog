require 'rails_helper'

describe 'Article API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic = create(:topic, user: @user)

    @tags                    = create_list(:tag, 5, user: @user)
    @article                 = create(:article_with_tags, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
    @relation_tags_article   = create(:article_with_relation_tags, user: @user, topic: @topic, parent_tags: [@tags[1], @tags[2]], child_tags: [@tags[3]])
    @relation_tags_article_2 = create(:article_with_relation_tags, user: @user, topic: @topic, parent_tags: [@tags[1], @tags[3]], child_tags: [@tags[2], @tags[4]])

    @other_topic     = create(:topic, user: @user)
    @private_article = create(:article, user: @user, topic: @other_topic, visibility: 'only_me')
  end

  let(:article_attributes) {
    {
      article: { title: 'title', summary: 'summary', content: 'content' }
    }
  }
  let(:article_error_attributes) {
    {
      article: article_attributes.merge(
        title:   'title' * 30,
        content: nil
      )
    }
  }
  let(:updated_article_attributes) {
    {
      article: { title: 'updated title' }
    }
  }

  describe '/articles' do
    context 'when no parameters and not connected' do
      it 'returns all public articles' do
        get '/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(3)
      end

      it 'limits to 12 articles' do
        create_list(:article, 10, user: @user, topic: @topic)

        get '/articles', as: :json

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(12)
      end
    end

    context 'when no parameters and owner is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public and private articles for current user' do
        get '/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(4)
      end
    end

    context 'when filtering articles' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns articles for topic' do
        get '/articles', params: { filter: { topic_id: @topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(3)

        get '/articles', params: { filter: { topic_id: @other_topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)
      end

      it 'returns articles for tags' do
        get '/articles', params: { filter: { tag_ids: [@tags[0].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)

        get '/articles', params: { filter: { tag_ids: [@tags[0].id, @tags[1].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(3)
      end

      it 'returns articles for parent tags' do
        get '/articles', params: { filter: { parent_tag_ids: [@tags[0].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty

        get '/articles', params: { filter: { parent_tag_ids: [@tags[1].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(2)
      end

      it 'returns articles for child tags' do
        get '/articles', params: { filter: { child_tag_ids: [@tags[0].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty

        get '/articles', params: { filter: { child_tag_ids: [@tags[2].id] } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)
      end

      it 'returns bookmarked articles for current user' do
        get '/articles', params: { filter: { bookmarked: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty
      end

      it 'returns draft articles for current user' do
        get '/articles', params: { filter: { draft: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all articles' do
        get '/articles', as: :json

        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(4)
      end
    end
  end

  describe '/articles/:id (HTML)' do
    it 'returns the page' do
      get "/articles/#{@article.id}"

      expect(response).to be_html_response
      expect(response.body).to match('id="article-show-component"')
    end
  end

  describe '/articles/:id' do
    context 'when user is not connected but article is private' do
      it 'returns an error message' do
        get "/articles/#{@private_article.id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected but article is private' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

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
        expect(article['article']['title']).to eq(@private_article.title)
      end
    end

    context 'when article is public' do
      it 'returns the associated article' do
        get "/articles/#{@article.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(@article.title)
      end
    end
  end

  describe '/articles/:id/history' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/articles/#{@article.id}/history", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        @original_title = @article.title
        @article.update_attributes(title: 'title 2')
        @article.update_attributes(title: 'title 3')
      end

      it 'returns the article history' do
        get "/articles/#{@article.id}/history", as: :json

        expect(response).to be_json_response
        json_history = JSON.parse(response.body)
        expect(json_history['history']).not_to be_empty
        expect(json_history['history'].size).to eq(2)
        articles_history = json_history['history'].map { |m| m['article']['title'] }
        expect(articles_history).to eq([@original_title, 'title 2'])
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

      it 'returns a new article associated to current topic' do
        expect {
          post '/articles', params: article_attributes, as: :json
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(article_attributes[:article][:title])
        expect(article['article']['topic_id']).to eq(@user.current_topic_id)
        expect(article['article']['tags'].size).to eq(0)
      end

      it 'returns a new article with new tags associated to current topic' do
        expect {
          post '/articles', params: article_attributes.deep_merge(article: { tags: ['new tag 1', 'new tag 2'] }), as: :json
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)
        expect(article['article']['parent_tags']).to be_empty
        expect(article['article']['child_tags']).to be_empty

        expect(Tag.last(2).first.topics.last).to eq(@user.current_topic)
        expect(Tag.last(2).second.topics.last).to eq(@user.current_topic)
      end

      it 'returns a new article with existing tags associated to current topic' do
        expect {
          post '/articles', params: article_attributes.deep_merge(article: { tags: [@tags[0].name, @tags[1].name] }), as: :json
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)
        expect(article['article']['parent_tags']).to be_empty
        expect(article['article']['child_tags']).to be_empty

        expect(@tags[0].topics).to include(@user.current_topic)
        expect(@tags[1].topics).to include(@user.current_topic)
      end

      it 'returns a new article with parent and child tags associated' do
        expect {
          post '/articles', params: article_attributes.deep_merge(article: { parent_tags: [@tags[2].name], child_tags: [@tags[3].name] }), as: :json
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(1)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)
        expect(article['article']['parent_tags'].size).to eq(1)
        expect(article['article']['child_tags'].size).to eq(1)

        expect(@tags[2].children.last).to eq(@tags[3])
        expect(@tags[3].parents.last).to eq(@tags[2])
      end

      it 'returns a new article with selected visibility' do
        expect {
          post '/articles', params: article_attributes.deep_merge(article: { tags: ['tag public,everyone', 'tag private,only_me'] }), as: :json
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)

        expect(response).to be_json_response(201)

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)

        expect(Tag.find(article['article']['tags'][0]['id']).visibility).to eq('everyone')
        expect(Tag.find(article['article']['tags'][1]['id']).visibility).to eq('only_me')
      end
    end

    context 'when creating an article with errors' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the errors' do
        expect {
          post '/articles', params: article_error_attributes, as: :json
        }.to_not change(Article, :count)

        expect(response).to be_json_response(403)

        article = JSON.parse(response.body)
        expect(article['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.article_title_max_length))
        expect(article['content'].first).to eq(I18n.t('errors.messages.blank'))
      end
    end
  end

  describe '/articles/:id/edit (HTML)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/articles/#{@article.id}/edit"

        expect(response.status).to eq(302)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the page' do
        get "/articles/#{@article.id}/edit"

        expect(response).to be_html_response
        expect(response.body).to match('id="article-edit-component"')
      end
    end
  end

  describe '/articles (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/articles/#{@article.id}", params: article_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated article' do
        expect {
          put "/articles/#{@article.id}", params: updated_article_attributes, as: :json
        }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(updated_article_attributes[:article][:title])
        expect(article['article']['tags'].size).to eq(3)
      end

      it 'returns updated article with new tags' do
        expect {
          put "/articles/#{@article.id}", params: article_attributes.deep_merge(article: { tags: ['new tag 1', 'new tag 2'] }), as: :json
        }.to change(Article, :count).by(0).and change(Tag, :count).by(2).and change(TaggedArticle, :count).by(-1)

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)
        expect(article['article']['tags'].map { |t| t['name'] }).to include('New tag 1', 'New tag 2')
        expect(article['article']['parent_tags']).to be_empty
        expect(article['article']['child_tags']).to be_empty

        expect(TaggedArticle.where(article_id: article['article']['id']).first.tag.name).to eq('New tag 1')
        expect(TaggedArticle.where(article_id: article['article']['id']).second.tag.name).to eq('New tag 2')
      end

      it 'returns updated article and tags relationship' do
        expect {
          put "/articles/#{@relation_tags_article.id}", params: article_attributes.deep_merge(article: { parent_tags: [@tags[1].name], child_tags: [@tags[3].name] }), as: :json
        }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-1).and change(TagRelationship, :count).by(-1)

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].size).to eq(2)
        expect(article['article']['parent_tags'].size).to eq(1)
        expect(article['article']['child_tags'].size).to eq(1)
      end

      context 'when updating an article with errors' do
        before do
          login_as(@user, scope: :user, run_callbacks: false)
        end

        it 'returns the errors' do
          expect {
            put "/articles/#{@article.id}", params: article_error_attributes.merge(tags: ['test error' * 30]), as: :json
          }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)

          expect(response).to be_json_response(403)

          article = JSON.parse(response.body)
          expect(article['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.article_title_max_length))
          expect(article['content'].first).to eq(I18n.t('errors.messages.blank'))
        end
      end
    end
  end

  describe '/articles/:id/restore' do
    context 'when user is not connected' do
      it 'returns an error message' do
        get "/articles/#{@article.id}/restore", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        @original_title = @article.title
        @article.update_attributes({ title: 'title 2' })
        @article.update_attributes({ title: 'title 3' })
      end

      it 'returns not found if no history given' do
        get "/articles/#{@article.id}/restore", as: :json

        expect(response).to be_json_response(404)
        json_history = JSON.parse(response.body)
        expect(json_history).to be_empty
      end

      it 'returns the restored article' do
        get "/articles/#{@article.id}/restore", params: { version_id: PaperTrail::Version.last.id }, as: :json

        expect(response).to be_json_response(202)
        json_history = JSON.parse(response.body)
        expect(json_history['article']).not_to be_empty
        expect(json_history['article']['title']).to eq('title 2')
      end
    end
  end

  describe '/articles/:id (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/articles/#{@article.id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the soft deleted article id' do
        expect {
          delete "/articles/#{@article.id}", as: :json
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)

        expect(response).to be_json_response(202)

        article = JSON.parse(response.body)
        expect(article['id']).to eq(@article.id)
      end

      it 'returns the soft deleted article id with relationships removed' do
        expect {
          delete "/articles/#{@relation_tags_article.id}", as: :json
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(-2).and change(TagRelationship.with_deleted, :count).by(0)

        expect(response).to be_json_response(202)

        article = JSON.parse(response.body)
        expect(article['id']).to eq(@relation_tags_article.id)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'can remove permanently an article' do
        expect {
          delete "/articles/#{@article.id}", params: { permanently: true }, as: :json
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(-1).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(-3).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)

        expect(response).to be_json_response(202)

        article = JSON.parse(response.body)
        expect(article['id']).to eq(@article.id)
      end
    end
  end

  context 'comments' do
    before(:all) do
      @comments = create_list(:comment, 5, user: @other_user, commentable: @relation_tags_article_2)
    end

    let(:comment_attributes) {
      {
        comment: { title: 'title', body: 'The comment' }
      }
    }

    let(:comment_updated_attributes) {
      {
        comment: { id: @comments.first.id, title: 'title updated', body: 'The comment updated' }
      }
    }

    describe '/articles/:id/comments' do
      it 'returns all comments for this article' do
        get "/articles/#{@relation_tags_article_2.id}/comments", as: :json

        expect(response).to be_json_response

        json_comments = JSON.parse(response.body)
        expect(json_comments['comments']).not_to be_empty
        expect(json_comments['comments'].size).to eq(5)
      end
    end

    describe '/articles/:id/comments (POST)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          post "/articles/#{@relation_tags_article_2.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'creates a new comment associated to this article' do
          post "/articles/#{@relation_tags_article_2.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['comment']).not_to be_empty
          expect(json_comment['comment']['title']).to eq(comment_attributes[:comment][:title])
        end
      end
    end

    describe '/articles/:id/comments (PUT)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          put "/articles/#{@relation_tags_article_2.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'updates a comment associated to this article' do
          put "/articles/#{@relation_tags_article_2.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['comment']).not_to be_empty
          expect(json_comment['comment']['title']).to eq(comment_updated_attributes[:comment][:title])
        end
      end
    end

    describe '/articles/:id/comments (DELETE)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          delete "/articles/#{@relation_tags_article_2.id}/comments", params: { comment: { id: @comments.second.id } }, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'deletes a comment associated to this article' do
          delete "/articles/#{@relation_tags_article_2.id}/comments", params: { comment: { id: @comments.second.id } }, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['ids']).not_to be_empty
          expect(json_comment['ids'].first).to eq(@comments.second.id)
        end
      end
    end
  end

  context 'tracker' do
    describe '/articles/:id/clicked' do
      it 'counts a new click on article' do
        post "/articles/#{@relation_tags_article_2.id}/clicked", as: :json

        expect(response).to be_json_response
        expect(response.body).to be_empty
      end
    end

    describe '/articles/:id/viewed' do
      it 'counts a new view on article' do
        post "/articles/#{@relation_tags_article_2.id}/viewed", as: :json

        expect(response).to be_json_response
        expect(response.body).to be_empty
      end
    end
  end

end
