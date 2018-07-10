require 'rails_helper'

describe 'Article API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic = create(:topic, user: @user)

    @public_tags             = create_list(:tag, 5, user: @user, visibility: 'everyone')
    @article                 = create(:article_with_tags, user: @user, topic: @topic, tags: [@public_tags[0], @public_tags[1], @public_tags[2]])
    @relation_tags_article   = create(:article_with_relation_tags, user: @user, topic: @topic, parent_tags: [@public_tags[1], @public_tags[2]], child_tags: [@public_tags[3]])
    @relation_tags_article_2 = create(:article_with_relation_tags, user: @user, topic: @topic, parent_tags: [@public_tags[1], @public_tags[3]], child_tags: [@public_tags[2], @public_tags[4]])

    @private_tags              = create_list(:tag, 2, user: @user, visibility: 'only_me')
    @article_with_private_tags = create(:article_with_tags, user: @user, topic: @topic, tags: [@private_tags[0], @private_tags[1]])

    @second_article = create(:article, user: @user, topic: @topic)

    @article_with_mixed_tags = create(:article_with_relation_tags, user: @user, topic: @topic, title: 'mixed_tags', parent_tags: [@public_tags[0], @private_tags[0]], child_tags: [@public_tags[1], @private_tags[1]])

    @second_topic    = create(:topic, user: @user)
    @private_article = create(:article, user: @user, topic: @second_topic, visibility: 'only_me')

    @other_topic      = create(:topic, user: @other_user)
    @other_public_tag = create(:tag, user: @other_user, visibility: 'everyone')
  end

  let(:article_attributes) {
    {
      article: { title: 'title', summary: 'summary', content: 'content' }
    }
  }
  let(:article_error_attributes) {
    {
      article: {
        title:     'title' * 30,
        content:   nil,
        reference: nil
      }
    }
  }
  let(:updated_article_attributes) {
    {
      article: { title: 'updated title' }
    }
  }

  describe '/api/v1/articles' do
    context 'when no parameters and not connected' do
      it 'returns all public articles' do
        get '/api/v1/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(6)
      end

      it 'returns articles in summary format' do
        get '/api/v1/articles', params: { summary: true }, as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(6)
      end

      it 'limits the number of articles' do
        create_list(:article, 10, user: @user, topic: @topic)

        get '/api/v1/articles', as: :json

        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to be <= Setting.per_page
      end
    end

    context 'when no parameters and owner is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public and private articles for current user' do
        get '/api/v1/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(7)
      end
    end

    context 'when filtering articles' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns articles for topic' do
        get '/api/v1/articles', params: { filter: { topic_id: @topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(6)

        get '/api/v1/articles', params: { filter: { topic_id: @second_topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)
      end

      it 'returns articles for tags' do
        get '/api/v1/articles', params: { filter: { tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(2)

        # get '/api/v1/articles', params: { filter: { tag_slugs: [@public_tags[0].slug, @public_tags[1].slug] } }, as: :json
        # json_articles = JSON.parse(response.body)
        # expect(json_articles['articles'].size).to eq(3)
      end

      it 'returns articles for parent and child tags' do
        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[0].slug, child_tag_slug: @public_tags[1].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)

        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[1].slug, child_tag_slug: @public_tags[3].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)
      end

      it 'returns articles for parent tags' do
        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)

        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[1].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(2)
      end

      it 'returns articles for child tags' do
        get '/api/v1/articles', params: { filter: { child_tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty

        get '/api/v1/articles', params: { filter: { child_tag_slug: @public_tags[2].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles'].size).to eq(1)
      end

      it 'returns bookmarked articles for current user' do
        get '/api/v1/articles', params: { filter: { bookmarked: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty
      end

      it 'returns draft articles for current user' do
        get '/api/v1/articles', params: { filter: { draft: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).to be_empty
      end
    end

    context 'when fetching public articles' do
      it 'returns public articles without private tags' do
        get '/api/v1/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        tags_for_mixed_article = json_articles['articles'].select { |article| article['title'] == 'mixed_tags' }.first['tags'].map { |tag| tag['name'] }
        expect(tags_for_mixed_article.sort).to eq([@public_tags[0].name, @public_tags[1].name].sort)
      end
    end

    context 'when fetching articles in database' do
      it 'limits the number of database queries' do
        expect {
          get '/api/v1/articles', params: { filter: { topic_id: @topic.id }, limit: 20 }, as: :json
        }.to make_database_queries(count: 5..10)
      end
    end

    context 'when lot of articles' do
      let!(:articles) { create_list(:article, 100, user: @user, topic: @topic) }

      it 'returns all articles in less than 1 second' do
        expect {
          get '/api/v1/articles', params: { filter: { topic_id: @topic.id }, limit: 1_000 }, as: :json
        }.to take_less_than(1).seconds
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all articles' do
        get '/api/v1/articles', as: :json

        json_articles = JSON.parse(response.body)
        expect(json_articles['articles']).not_to be_empty
        expect(json_articles['articles'].size).to eq(7)
      end
    end
  end

  describe '/api/v1/articles/:id' do
    context 'when user is not connected but article is private' do
      it 'returns an error message' do
        get "/api/v1/articles/#{@private_article.id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected but article is private' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/articles/#{@private_article.id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected and article is private' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the associated article' do
        get "/api/v1/articles/#{@private_article.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(@private_article.title)
      end
    end

    context 'when article is public' do
      it 'returns the associated article' do
        get "/api/v1/articles/#{@article.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['title']).to eq(@article.title)
      end

      it 'returns the article without private tags' do
        get "/api/v1/articles/#{@article_with_mixed_tags.id}", as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['article']).not_to be_empty
        expect(article['article']['tags'].map { |tag| tag['name'] }.sort).to eq([@public_tags[0].name, @public_tags[1].name].sort)
      end
    end
  end

  describe '/api/v1/articles (POST)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        post '/api/v1/articles', params: article_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new article associated to current topic of the user by default' do
        expect {
          post '/api/v1/articles', params: article_attributes, as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['title']).to eq(article_attributes[:article][:title])
          expect(article['article']['topicId']).to eq(@user.current_topic_id)
          expect(article['article']['tags'].size).to eq(0)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
      end

      it 'returns a new article associated to a specific topic if user owns the topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { topic_id: @second_topic.id }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['topicId']).to eq(@second_topic.id)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
      end

      it 'returns a new article with reference url formatted' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { reference: 'test.com' }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['reference']).to eq('http://test.com')
        }.to change(Article, :count).by(1)
      end

      it 'returns a new article with a different language' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { language: 'en' }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['currentLanguage']).to eq('en')
          expect(Article.last.title_translations).to eq({ 'en' => article_attributes[:article][:title] })
        }.to change(Article, :count).by(1)
      end

      it 'returns a new article with relationships to other articles' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { content: "link to other <a data-article-relation-id=#{@private_article.id}>article</a>." }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['content']).to match('data-article-relation-id')

          relationships = Article.last.child_relationships.last
          expect(relationships).not_to be nil
          expect(relationships.parent_id).to eq(@private_article.id)
          expect(relationships.child_id).to eq(article['article']['id'])
        }.to change(Article, :count).by(1)
      end

      it 'returns a new article with new tags associated to the current topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: 'new tag 1', visibility: 'everyone' }, { name: 'new tag 2', visibility: 'everyone' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
          expect(article['article']['parentTagIds']).to be_empty
          expect(article['article']['childTagIds']).to be_empty

          expect(Tag.last(2).first.topics.last).to eq(@user.current_topic)
          expect(Tag.last(2).second.topics.last).to eq(@user.current_topic)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with existing tags associated to current topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @public_tags[0].name, visibility: @public_tags[0].visibility }, { name: @public_tags[1].name, visibility: @public_tags[1].visibility }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
          expect(article['article']['parentTagIds']).to be_empty
          expect(article['article']['childTagIds']).to be_empty

          expect(@public_tags[0].topics).to include(@user.current_topic)
          expect(@public_tags[1].topics).to include(@user.current_topic)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0)
      end

      it 'returns a new article with parent and child tags associated' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { parent_tags: [{ name: @public_tags[2].name, visibility: @public_tags[2].visibility }], child_tags: [{ name: @public_tags[3].name, visibility: @public_tags[3].visibility }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
          expect(article['article']['parentTagIds'].size).to eq(1)
          expect(article['article']['childTagIds'].size).to eq(1)

          expect(@public_tags[2].children.last).to eq(@public_tags[3])
          expect(@public_tags[3].parents.last).to eq(@public_tags[2])
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(1)
      end

      it 'returns a new article with tags having the correct visibility' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: 'tag public', visibility: 'everyone' }, { name: 'tag private', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)

          expect(Tag.find(article['article']['tags'][0]['id']).visibility).to eq('everyone')
          expect(Tag.find(article['article']['tags'][1]['id']).visibility).to eq('only_me')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with tags having the correct association and visibility' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { parent_tags: [{ name: 'parent tag public', visibility: 'everyone' }], child_tags: [{ name: 'child tag private', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)

          public_parent_tag = Tag.find(article['article']['tags'][0]['id'])
          private_child_tag = Tag.find(article['article']['tags'][1]['id'])
          expect(public_parent_tag.children.last).to eq(private_child_tag)
          expect(private_child_tag.parents.last).to eq(public_parent_tag)
          expect(public_parent_tag.visibility).to eq('everyone')
          expect(private_child_tag.visibility).to eq('only_me')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with a public tag from another user' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @other_public_tag.name, visibility: 'everyone' }, { name: 'private tag', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(1)
      end

      it 'returns a new article with a new private tag even if tag is used in another topic' do
        @user.update_attribute(:current_topic_id, @second_topic.id)

        begin
          expect {
            post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @private_tags[0].name, visibility: 'only_me' }, { name: @private_tags[1].name, visibility: 'only_me' }] }), as: :json

            expect(response).to be_json_response(201)

            article = JSON.parse(response.body)
            expect(article['article']).not_to be_empty
            expect(article['article']['tags'].size).to eq(2)
          }.to change(Article, :count).by(1).and change(Tag, :count).by(0)
        ensure
          @user.update_attribute(:current_topic_id, @topic.id)
        end
      end

      it 'returns a new article even if same tag for parent and child' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { parent_tags: [{ name: 'same tag', visibility: 'only_me' }], child_tags: [{ name: 'same tag', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(1)

          expect(Tag.find(article['article']['tags'][0]['id']).visibility).to eq('only_me')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(1)
      end
    end

    context 'when creating an article with errors' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the errors for incorrect attributes' do
        expect {
          post '/api/v1/articles', params: article_error_attributes, as: :json

          expect(response).to be_json_response(422)

          article = JSON.parse(response.body)
          expect(article['errors']['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.article_title_max_length))
          expect(article['errors']['content'].first).to eq(I18n.t('errors.messages.blank'))
        }.to_not change(Article, :count)
      end

      it 'returns a error if topic do not belong to current user' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { topic_id: @other_topic.id }), as: :json

          expect(response).to be_json_response(422)

          article = JSON.parse(response.body)
          expect(article['errors']['topic'].first).to eq(I18n.t('activerecord.errors.models.article.bad_topic_owner'))
        }.to_not change(Article, :count)
      end
    end
  end

  describe '/api/v1/articles (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/api/v1/articles/#{@article.id}", params: article_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns updated article' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: updated_article_attributes, as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['title']).to eq(updated_article_attributes[:article][:title])
          expect(article['article']['tags'].size).to eq(3)
        }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
      end

      it 'returns updated article with new relationships' do
        expect {
          @article.format_attributes(content: "link to other <a data-article-relation-id=#{@private_article.id}>article</a>.")
          @article.save!
          relationships = @article.child_relationships
          expect(relationships.count).to eq(1)
          expect(relationships.first.parent_id).to eq(@private_article.id)
          expect(relationships.first.child_id).to eq(@article.id)

          put "/api/v1/articles/#{@article.id}", params: updated_article_attributes.deep_merge(article: { content: "link to another <a data-article-relation-id=#{@second_article.id}>article</a>." }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['content']).to match('data-article-relation-id')

          @article.reload
          relationships = @article.child_relationships
          expect(relationships.count).to eq(1)
          expect(relationships.first.parent_id).to eq(@second_article.id)
          expect(relationships.first.child_id).to eq(article['article']['id'])
        }.not_to change(Article, :count)
      end

      it 'returns updated article with new tags' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: article_attributes.deep_merge(article: { tags: [{ name: 'new tag 1', visibility: 'everyone' }, { name: 'new tag 2', visibility: 'everyone' }] }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
          expect(article['article']['tags'].map { |t| t['name'] }).to include('New tag 1', 'New tag 2')
          expect(article['article']['parentTagIds']).to be_empty
          expect(article['article']['childTagIds']).to be_empty

          expect(TaggedArticle.where(article_id: article['article']['id']).first.tag.name).to eq('New tag 1')
          expect(TaggedArticle.where(article_id: article['article']['id']).second.tag.name).to eq('New tag 2')
        }.to change(Article, :count).by(0).and change(Tag, :count).by(2).and change(TaggedArticle, :count).by(-1)
      end

      it 'returns updated article and tags relationship' do
        expect {
          put "/api/v1/articles/#{@relation_tags_article.id}", params: article_attributes.deep_merge(article: { parent_tags: [{ name: @public_tags[1].name, visibility: @public_tags[1].visibility }], child_tags: [{ name: @public_tags[3].name, visibility: @public_tags[3].visibility }] }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['article']).not_to be_empty
          expect(article['article']['tags'].size).to eq(2)
          expect(article['article']['parentTagIds'].size).to eq(1)
          expect(article['article']['childTagIds'].size).to eq(1)
        }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-1).and change(TagRelationship, :count).by(-1)
      end

      context 'when updating an article with errors' do
        before do
          login_as(@user, scope: :user, run_callbacks: false)
        end

        it 'returns the errors' do
          expect {
            put "/api/v1/articles/#{@article.id}", params: article_error_attributes.merge(tags: ['test error' * 30]), as: :json

            expect(response).to be_json_response(422)

            article = JSON.parse(response.body)
            expect(article['errors']['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: CONFIG.article_title_max_length))
            expect(article['errors']['content'].first).to eq(I18n.t('errors.messages.blank'))
          }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
        end
      end
    end
  end

  describe '/api/v1/articles/:id (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/api/v1/articles/#{@article.id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the soft deleted article id' do
        expect {
          delete "/api/v1/articles/#{@article.id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end

      it 'returns the soft deleted article id with relationships removed' do
        expect {
          delete "/api/v1/articles/#{@relation_tags_article.id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(-2).and change(TagRelationship.with_deleted, :count).by(0)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'can remove permanently an article' do
        expect {
          delete "/api/v1/articles/#{@article.id}", params: { permanently: true }, as: :json

          expect(response).to be_json_response(204)
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(-1).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-3).and change(TaggedArticle.with_deleted, :count).by(-3).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
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

    # TODO: test comments with error

    describe '/api/v1/articles/:id/comments' do
      it 'returns all comments for this article' do
        get "/api/v1/articles/#{@relation_tags_article_2.id}/comments", as: :json

        expect(response).to be_json_response

        json_comments = JSON.parse(response.body)
        expect(json_comments['comments']).not_to be_empty
        expect(json_comments['comments'].size).to eq(5)
      end
    end

    describe '/api/v1/articles/:id/comments (POST)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          post "/api/v1/articles/#{@relation_tags_article_2.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'creates a new comment associated to this article' do
          post "/api/v1/articles/#{@relation_tags_article_2.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['comment']).not_to be_empty
          expect(json_comment['comment']['title']).to eq(comment_attributes[:comment][:title])
        end
      end
    end

    describe '/api/v1/articles/:id/comments (PUT)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          put "/api/v1/articles/#{@relation_tags_article_2.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'updates a comment associated to this article' do
          put "/api/v1/articles/#{@relation_tags_article_2.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['comment']).not_to be_empty
          expect(json_comment['comment']['title']).to eq(comment_updated_attributes[:comment][:title])
        end
      end
    end

    describe '/api/v1/articles/:id/comments (DELETE)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          delete "/api/v1/articles/#{@relation_tags_article_2.id}/comments", as: :json, params: { comment: { id: @comments.second.id } }

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'deletes a comment associated to this article' do
          delete "/api/v1/articles/#{@relation_tags_article_2.id}/comments", as: :json, params: { comment: { id: @comments.second.id } }

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['deletedCommentIds']).not_to be_empty
          expect(json_comment['deletedCommentIds'].first).to eq(@comments.second.id)
        end
      end
    end
  end

  context 'tracker' do
    # TODO: add click with user_id to call add_visit_activity
    describe '/api/v1/articles/:id/clicked' do
      it 'counts a new click on article' do
        post "/api/v1/articles/#{@relation_tags_article_2.id}/clicked", as: :json

        expect(response).to be_json_response(204)
      end
    end

    describe '/api/v1/articles/:id/viewed' do
      it 'counts a new view on article' do
        post "/api/v1/articles/#{@relation_tags_article_2.id}/viewed", as: :json

        expect(response).to be_json_response(204)
      end
    end
  end

end
