# frozen_string_literal: true

require 'rails_helper'

describe 'Article API', type: :request do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic = create(:topic, user: @user)

    @public_tags             = create_list(:tag, 5, user: @user, visibility: :everyone)
    @article                 = create(:article, user: @user, topic: @topic, tags: [@public_tags[0], @public_tags[1], @public_tags[2]])
    @relation_tags_article   = create(:article, user: @user, topic: @topic, parent_tags: [@public_tags[1], @public_tags[2]], child_tags: [@public_tags[3]])
    @relation_tags_article_2 = create(:article, user: @user, topic: @topic, parent_tags: [@public_tags[1], @public_tags[3]], child_tags: [@public_tags[2], @public_tags[4]])

    @private_tags         = create_list(:tag, 2, user: @user, visibility: :only_me)
    @private_tags_article = create(:article, user: @user, topic: @topic, tags: [@private_tags[0], @private_tags[1]], visibility: :only_me)

    @second_article = create(:article, user: @user, topic: @topic, tags: [@public_tags[4]])

    @multi_lg_article = create(:article, user: @user, topic: @topic, title: 'Article multi language', languages: ['fr', 'en'], tags: [@public_tags[0]])
    I18n.with_locale(:fr) { @multi_lg_article.update(title: 'Article multi language FR') }

    @article_with_mixed_tags = create(:article, user: @user, topic: @topic, title: 'mixed_tags', parent_tags: [@public_tags[0], @private_tags[0]], child_tags: [@public_tags[1], @private_tags[1]])

    @second_topic    = create(:topic, user: @user)
    @private_article = create(:article, user: @user, topic: @second_topic, visibility: :only_me, draft: true)

    @inventories_topic = create(:topic, user: @user, mode: :inventories, inventory_fields: [{
                                                                                              field_name: 'string',
                                                                                              name:       'String',
                                                                                              value_type: 'string_type'
                                                                                            },
                                                                                            {
                                                                                              field_name: 'text',
                                                                                              name:       'Text',
                                                                                              value_type: 'text_type'
                                                                                            }
    ])

    @other_topic      = create(:topic, user: @other_user)
    @other_public_tag = create(:tag, user: @other_user, visibility: :everyone)
  end

  let(:article_attributes) {
    {
      article: {
        title:      'title',
        summary:    'summary',
        content:    'content',
        visibility: 'only_me',
        tags:       [{ name: @private_tags[0].name, visibility: @private_tags[0].visibility }]
      }
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

  describe '/users/:user_slug/topics/:topic_slug (HTML)' do
    it 'returns user articles for the given topic' do
      get "/users/#{@user.slug}/topics/#{@topic.slug}"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('data-articles="{')
    end
  end

  describe '/tagged/:tag_slug (HTML)' do
    it 'returns all articles for the given tag' do
      get "/tagged/#{@public_tags.first.slug}"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('data-articles="{')
    end
  end

  describe '/users/:user_slug/articles/:article_slug (HTML)' do
    it 'returns the user article' do
      get "/users/#{@user.slug}/articles/#{@article.slug}"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('data-article="{')
    end

    it 'redirects to the correct locale for articles with multiple locales' do
      get "/users/#{@user.slug}/articles/#{@multi_lg_article.slug_translations['fr']}"

      expect(response.status).to eq(301)
      # expect(response.body).to include("/fr/utilisateurs/#{@user.slug}/articles/#{@multi_lg_article.slug_translations['fr']}")
    end

    it 'redirects to the new slug' do
      previous_slug = @multi_lg_article.slug
      new_slug      = Articles::StoreService.new(@multi_lg_article, title: 'New article multi language', current_user: @user).perform.result.slug

      get "/users/#{@user.slug}/articles/#{previous_slug}"

      expect(response.status).to eq(301)
      # expect(response.body).to include("/users/#{@user.slug}/articles/#{new_slug}")
    end

    it 'redirects to the correct locale for article with one locale only' do
      get "/fr/utilisateurs/#{@user.slug}/articles/#{@article.slug}"

      expect(response.status).to eq(301)
      # expect(response.body).to include("/users/#{@user.slug}/articles/#{@article.slug}")
    end
  end

  describe '/users/:user_slug/articles/:article_slug/edit (HTML)' do
    before do
      login_as(@user, scope: :user, run_callbacks: false)
    end

    it 'returns the user article for editing' do
      get "/users/#{@user.slug}/articles/#{@article.slug}/edit"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('data-article="{')
    end
  end

  describe '/api/v1/articles' do
    context 'when no parameters and not connected' do
      it 'returns all public articles' do
        get '/api/v1/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).not_to be_empty
        expect(json_articles['data'].size).to eq(Article.everyone.count)
      end

      it 'returns articles in summary format' do
        get '/api/v1/articles', params: { summary: true }, as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).not_to be_empty
        expect(json_articles['data'].size).to eq(Article.everyone.count)
      end

      it 'limits the number of articles' do
        create_list(:article, 10, user: @user, topic: @topic)

        get '/api/v1/articles', as: :json

        json_articles = JSON.parse(response.body)

        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).not_to be_empty
        expect(json_articles['data'].size).to be <= InRailsWeBlog.settings.per_page
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

        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).not_to be_empty
        expect(json_articles['data'].size).to eq(8)
      end
    end

    context 'when filtering articles' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns articles for user topic' do
        get '/api/v1/articles', params: { filter: { user_id: @user.id, topic_id: @topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(7)

        get '/api/v1/articles', params: { filter: { user_id: @user.id, topic_id: @second_topic.id } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)
      end

      it 'returns articles for this tag only' do
        @user.settings['tag_parent_and_child'] = false
        @user.save

        get '/api/v1/articles', params: { filter: { tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(2)

        # get '/api/v1/articles', params: { filter: { tag_slugs: [@public_tags[0].slug, @public_tags[1].slug] } }, as: :json
        # json_articles = JSON.parse(response.body)
        # expect(json_articles['data'].size).to eq(7)
      end

      it 'returns articles for this tag and its children' do
        @user.settings['tag_parent_and_child'] = true
        @user.save

        get '/api/v1/articles', params: { filter: { tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(3)

        # get '/api/v1/articles', params: { filter: { tag_slugs: [@public_tags[0].slug, @public_tags[1].slug] } }, as: :json
        # json_articles = JSON.parse(response.body)
        # expect(json_articles['data'].size).to eq(7)
      end

      it 'returns articles for parent and child tags' do
        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[0].slug, child_tag_slug: @public_tags[1].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)

        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[1].slug, child_tag_slug: @public_tags[3].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)
      end

      it 'returns articles for parent tags' do
        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)

        get '/api/v1/articles', params: { filter: { parent_tag_slug: @public_tags[1].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(2)
      end

      it 'returns articles for child tags' do
        get '/api/v1/articles', params: { filter: { child_tag_slug: @public_tags[0].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).to be_empty

        get '/api/v1/articles', params: { filter: { child_tag_slug: @public_tags[2].slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)
      end

      it 'returns bookmarked articles for current user' do
        get '/api/v1/articles', params: { filter: { bookmarked: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).to be_empty
      end

      it 'returns draft articles for current user' do
        get '/api/v1/articles', params: { filter: { draft: true } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data'].size).to eq(1)
      end
    end

    context 'when fetching public articles' do
      it 'returns public articles without private tags of other users' do
        get '/api/v1/articles', as: :json

        expect(response).to be_json_response

        json_articles = JSON.parse(response.body)

        expect(json_articles['meta']['root']).to eq('articles')
        tags_for_mixed_article = json_articles['data'].select { |article| article['attributes']['title'] == 'mixed_tags' }.first['relationships']['tags']['data'].map { |tag| tag['id'] }
        expect(tags_for_mixed_article.sort).to eq([@public_tags[0].id.to_s, @public_tags[1].id.to_s, @private_tags[0].id.to_s, @private_tags[1].id.to_s].sort)
      end
    end

    context 'when fetching articles in database' do
      it 'limits the number of database queries' do
        expect {
          get '/api/v1/articles', params: { filter: { user_id: @user.id, topic_id: @topic.id }, limit: 20 }, as: :json
        }.to make_database_queries(count: 12..18)
      end
    end

    context 'when lot of articles' do
      let!(:articles) { create_list(:article, 100, user: @user, topic: @topic) }

      it 'returns all articles in less than 1 second' do
        expect {
          get '/api/v1/articles', params: { filter: { user_id: @user.id, topic_id: @topic.id }, limit: 1_000 }, as: :json
        }.to take_less_than(1).seconds
      end
    end

    context 'when seo data are defined' do
      before do
        Seo::Data.create(name: 'user_articles_en', locale: 'en', page_title: 'User articles title', meta_desc: 'User articles meta-desc')
      end

      it 'return articles with seo data' do
        get '/api/v1/articles', params: { filter: { user_slug: @user.slug } }, as: :json
        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['metaTags']).to be_a(Hash)
        expect(json_articles['meta']['metaTags']['title']).to include('User articles title')
        expect(json_articles['meta']['metaTags']['description']).to eq('User articles meta-desc')
        expect(json_articles['meta']['metaTags']['alternate']).not_to be_empty
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all articles' do
        get '/api/v1/articles', as: :json

        json_articles = JSON.parse(response.body)
        expect(json_articles['meta']['root']).to eq('articles')
        expect(json_articles['data']).not_to be_empty
        expect(json_articles['data'].size).to eq(8)
      end
    end
  end

  describe '/api/v1/articles/:id' do
    context 'when user is not connected but article is private' do
      it 'returns an error message' do
        get "/api/v1/articles/#{@private_article.id}", as: :json

        expect(response).to be_not_found
      end
    end

    context 'when another user is connected but article is private' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/articles/#{@private_article.id}", as: :json

        expect(response).to be_not_found
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
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['title']).to eq(@private_article.title)
      end
    end

    context 'when article is public' do
      it 'returns the associated article' do
        get "/api/v1/articles/#{@article.id}", params: { user_id: @article.user.slug }, as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['title']).to eq(@article.title)
      end

      it 'returns an index page for article with content in current language' do
        get "/api/v1/articles/#{@article.id}", params: { user_id: @article.user.slug }, as: :json

        article = JSON.parse(response.body)
        expect(article['meta']['metaTags']['noindex']).to be nil
      end

      it 'returns a noindex page for empty article content in current language' do
        get "/api/v1/articles/#{@article.id}", params: { user_id: @article.user.slug, force_locale: 'fr' }, as: :json

        article = JSON.parse(response.body)
        expect(article['meta']['metaTags']['noindex']).to be true
      end

      it 'returns the article without private tags of other users' do
        get "/api/v1/articles/#{@article_with_mixed_tags.id}", params: { user_id: @article_with_mixed_tags.user.slug }, as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['relationships']['tags']['data'].map { |tag| tag['id'] }.sort).to eq([@public_tags[0].id.to_s, @public_tags[1].id.to_s, @private_tags[0].id.to_s, @private_tags[1].id.to_s].sort)
      end
    end
  end

  describe '/api/v1/articles/:id/shared/:public_link' do
    before do
      @shared_link = create(:share, mode: :link, user: @user, shareable: @private_tags_article)
    end

    context 'when user is not connected and incorrect shared link' do
      it 'returns an error message' do
        get "/api/v1/articles/#{@private_tags_article.id}/shared/#{SecureRandom.uuid}", params: { user_id: @private_tags_article.user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is not connected and correct public link' do
      it 'returns the shared article' do
        get "/api/v1/articles/#{@private_tags_article.id}/shared/#{@shared_link.public_link}", params: { user_id: @private_tags_article.user.slug }, as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['title']).to eq(@private_tags_article.title)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/articles/#{@private_tags_article.id}/shared/nil", as: :json

        expect(response).to be_unauthorized
      end
    end
  end

  describe '/api/v1/articles/:id/recommendations' do
    context 'when user is not connected and article is private' do
      it 'returns an error' do
        get "/api/v1/articles/#{@private_article.id}/recommendations", params: { user_id: @private_article.user_id }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when article is public' do
      it 'returns associated articles' do
        get "/api/v1/articles/#{@article.id}/recommendations", params: { user_id: @article.user_id }, as: :json

        expect(response).to be_json_response

        articles = JSON.parse(response.body)
        expect(articles['data']).not_to be_empty
        expect(articles['data'][0]['attributes']['topicId']).to eq(@article.topic_id)
        expect(articles['data'][1]['attributes']['topicId']).to eq(@article.topic_id)
      end
    end
  end

  describe '/api/v1/articles/:id/tracking' do
    context 'when user is not connected' do
      it 'returns an error' do
        get "/api/v1/articles/#{@article.id}/tracking", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns tracking data' do
        get "/api/v1/articles/#{@article.id}/tracking", params: { user_id: @article.user_id }, as: :json

        expect(response).to be_json_response

        tracking = JSON.parse(response.body)
        expect(tracking['trackingData']['tracker']).not_to be_empty
        expect(tracking['trackingData']['commentsCount']).to eq(0)
        expect(tracking['trackingData']['countries']).to eq([])
        expect(tracking['trackingData']['referrers']).to eq([])
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
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['title']).to eq(article_attributes[:article][:title])
          expect(article['data']['attributes']['topicId']).to eq(@user.current_topic_id)
          expect(article['data']['relationships']['tags'].size).to eq(1)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0).and change(Article::Redirection, :count).by(0)
      end

      it 'returns a new article with reference url formatted' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { reference: 'test.com' }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['reference']).to eq('http://test.com')
        }.to change(Article, :count).by(1)
      end

      it 'returns a new article with relationships to other articles' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { content: "link to other <a data-article-relation-id=#{@private_article.id}>article</a>." }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['content']).to match('data-article-relation-id')

          relationships = Article.last.child_relationships.last
          expect(relationships).not_to be_nil
          expect(relationships.parent_id).to eq(@private_article.id)
          expect(relationships.child_id).to eq(article['data']['attributes']['id'])
        }.to change(Article, :count).by(1)
      end

      it 'returns a new article with new tags associated to the current topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: 'new tag 1', visibility: 'everyone' }, { name: 'new tag 2', visibility: 'everyone' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
          expect(article['data']['attributes']['parentTagIds']).to be_empty
          expect(article['data']['attributes']['childTagIds']).to be_empty

          expect(Tag.last(2).first.topics.last).to eq(@user.current_topic)
          expect(Tag.last(2).second.topics.last).to eq(@user.current_topic)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with existing tags associated to current topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @public_tags[0].name, visibility: @public_tags[0].visibility }, { name: @public_tags[1].name, visibility: @public_tags[1].visibility }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
          expect(article['data']['attributes']['parentTagIds']).to be_empty
          expect(article['data']['attributes']['childTagIds']).to be_empty

          expect(@public_tags[0].topics).to include(@user.current_topic)
          expect(@public_tags[1].topics).to include(@user.current_topic)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0)
      end

      it 'returns a new article with parent and child tags associated' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { parent_tags: [{ name: @public_tags[2].name, visibility: @public_tags[2].visibility }], child_tags: [{ name: @public_tags[3].name, visibility: @public_tags[3].visibility }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
          expect(article['data']['attributes']['parentTagIds'].size).to eq(1)
          expect(article['data']['attributes']['childTagIds'].size).to eq(1)

          expect(@public_tags[2].children.last).to eq(@public_tags[3])
          expect(@public_tags[3].parents.last).to eq(@public_tags[2])
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(1)
      end

      it 'returns a new article with tags having the correct visibility' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: 'Tag public', visibility: 'everyone' }, { name: 'Tag private', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)

          expect(Tag.find_by(name: 'Tag public').visibility).to eq('everyone')
          expect(Tag.find_by(name: 'Tag private').visibility).to eq('only_me')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with tags having the correct association and visibility' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { parent_tags: [{ name: 'Parent tag public', visibility: 'everyone' }], child_tags: [{ name: 'Child tag public', visibility: 'everyone' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)

          parent_tag = Tag.find_by(name: 'Parent tag public')
          child_tag  = Tag.find_by(name: 'Child tag public')
          expect(parent_tag.children.last).to eq(child_tag)
          expect(child_tag.parents.last).to eq(parent_tag)
          expect(parent_tag.visibility).to eq('everyone')
          expect(child_tag.visibility).to eq('everyone')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(2)
      end

      it 'returns a new article with a public tag from another user' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @other_public_tag.name, visibility: 'everyone' }, { name: 'private tag', visibility: 'only_me' }] }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(1)
      end

      it 'returns a new article with a new private tag even if tag is used in another topic' do
        @user.update_attribute(:current_topic_id, @second_topic.id)

        begin
          expect {
            post '/api/v1/articles', params: article_attributes.deep_merge(article: { tags: [{ name: @private_tags[0].name, visibility: 'only_me' }, { name: @private_tags[1].name, visibility: 'only_me' }] }), as: :json

            expect(response).to be_json_response(201)

            article = JSON.parse(response.body)
            expect(article['data']['attributes']).not_to be_empty
            expect(article['data']['relationships']['tags']['data'].size).to eq(2)
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
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(1)
          expect(Tag.find(article['data']['relationships']['tags']['data'][0]['id']).visibility).to eq('only_me')
        }.to change(Article, :count).by(1).and change(Tag, :count).by(1)
      end

      it 'returns a new article with inventory fields' do
        @user.update_attribute(:current_topic_id, @inventories_topic.id)

        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { inventories: { string: 'My string', text: '<p>My text</p>' } }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['mode']).to eq('inventory')
          expect(article['data']['attributes']['inventories'].size).to eq(2)
        }.to change(Article, :count).by(1)
      ensure
        @user.update_attribute(:current_topic_id, @topic.id)
      end
    end

    context 'when user is connected and has multilanguage option' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)

        @user.update(article_multilanguage: true)
      end

      after do
        @user.update(article_multilanguage: false)
      end

      it 'returns a new article with multiple languages' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: {
            title:                nil,
            title_translations:   { en: 'title en', fr: 'title fr' },
            content_translations: { en: 'content en', fr: 'content fr' }
          }), as:                          :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['languages']).to eq(['en', 'fr'])
          expect(article['data']['attributes']['titleTranslations']['fr']).to eq('title fr')
          expect(article['data']['attributes']['titleTranslations']['en']).to eq('title en')
          expect(article['data']['attributes']['content']).to eq('content en')
          expect(article['data']['attributes']['contentTranslations']['fr']).to eq('content fr')
          expect(article['data']['attributes']['contentTranslations']['en']).to eq('content en')
        }.to change(Article, :count).by(1)
      ensure
        I18n.locale = I18n.default_locale
      end
    end

    context 'when user is connected with another current topic' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns a new article associated to a specific topic if user owns the topic' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { user_id: @user.id, topic_id: @second_topic.id }), as: :json

          expect(response).to be_json_response(201)

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['topicId']).to eq(@second_topic.id)
        }.to change(Article, :count).by(1).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
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
          expect(article['errors']['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: InRailsWeBlog.settings.article_title_max_length))
          expect(article['errors']['content'].first).to eq(I18n.t('errors.messages.blank'))
        }.not_to change(Article, :count)
      end

      it 'returns a error if topic do not belong to current user' do
        expect {
          post '/api/v1/articles', params: article_attributes.deep_merge(article: { user_id: @other_user.id, topic_id: @other_topic.id }), as: :json

          expect(response).to be_json_response(422)

          article = JSON.parse(response.body)
          expect(article['errors']['topic'].first).to eq(I18n.t('activerecord.errors.models.article.bad_topic_owner'))
        }.not_to change(Article, :count)
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
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['title']).to eq(updated_article_attributes[:article][:title])
          expect(article['data']['relationships']['tags']['data'].size).to eq(3)
        }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
      end

      it 'returns updated article with new relationships' do
        expect {
          ::Articles::StoreService.new(@article, title: 'Test linked articles', content: "link to other <a data-article-relation-id=#{@private_article.id}>article</a>.", current_user: @user).perform
          @article.save!
          relationships = @article.child_relationships
          expect(relationships.count).to eq(1)
          expect(relationships.first.parent_id).to eq(@private_article.id)
          expect(relationships.first.child_id).to eq(@article.id)

          put "/api/v1/articles/#{@article.id}", params: updated_article_attributes.deep_merge(article: { content: "link to another <a data-article-relation-id=#{@second_article.id}>article</a>." }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['attributes']['content']).to match('data-article-relation-id')

          @article.reload
          relationships = @article.child_relationships
          expect(relationships.count).to eq(1)
          expect(relationships.first.parent_id).to eq(@second_article.id)
          expect(relationships.first.child_id).to eq(article['data']['attributes']['id'])
        }.not_to change(Article, :count)
      end

      it 'returns updated article with new tags' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: article_attributes.deep_merge(article: { tags: [{ name: 'new tag 1', visibility: 'everyone' }, { name: 'new tag 2', visibility: 'everyone' }] }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
          # expect(article['data']['relationships']['tags']['data'].map { |t| t['name'] }).to include('new tag 1', 'new tag 2')
          expect(article['data']['attributes']['parentTagIds']).to be_empty
          expect(article['data']['attributes']['childTagIds']).to be_empty

          expect(TaggedArticle.where(article_id: article['data']['attributes']['id']).first.tag.name).to eq('new tag 1')
          expect(TaggedArticle.where(article_id: article['data']['attributes']['id']).second.tag.name).to eq('new tag 2')
        }.to change(Article, :count).by(0).and change(Tag, :count).by(2).and change(TaggedArticle, :count).by(-1)
      end

      it 'returns updated article and tags relationship' do
        expect {
          put "/api/v1/articles/#{@relation_tags_article.id}", params: article_attributes.deep_merge(article: { parent_tags: [{ name: @public_tags[1].name, visibility: @public_tags[1].visibility }], child_tags: [{ name: @public_tags[3].name, visibility: @public_tags[3].visibility }] }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
          expect(article['data']['relationships']['tags']['data'].size).to eq(2)
          expect(article['data']['attributes']['parentTagIds'].size).to eq(1)
          expect(article['data']['attributes']['childTagIds'].size).to eq(1)
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
            expect(article['errors']['title'].first).to eq(I18n.t('errors.messages.too_long.other', count: InRailsWeBlog.settings.article_title_max_length))
          }.to change(Article, :count).by(0).and change(Tag, :count).by(0).and change(TagRelationship, :count).by(0)
        end
      end

      it 'saves a new version for each update' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: article_attributes.deep_merge(article: { content: 'content 2' }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
        }.to change(@article.reload.versions, :count).by(1)
      end

      it 'do not save a new version when auto-saving' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: { auto_save: true, **article_attributes.deep_merge(article: { content: 'content 3' }) }, as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
        }.to change(@article.reload.versions, :count).by(0)
      end

      it 'saves a new version after auto-saving' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: { was_auto_saved: true, **article_attributes.deep_merge(article: { content: 'content 4' }) }, as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
        }.to change(@article.reload.versions, :count).by(1)
      end

      it 'do not save a new version for draft articles' do
        expect {
          put "/api/v1/articles/#{@article.id}", params: article_attributes.deep_merge(article: { content: 'content 2', draft: true }), as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']).not_to be_empty
        }.to change(@article.reload.versions, :count).by(0)
      end

      it 'adds a redirection from the previous title' do
        expect {
          put "/api/v1/articles/#{@second_article.id}", params: { article: { title: @second_article.title + '-2' } }, as: :json

          expect(response).to be_json_response

          article = JSON.parse(response.body)
          expect(article['data']['attributes']['slug']).to eq(@second_article.slug.sub('@', '2@'))
        }.to change(Article::Redirection, :count).by(1)

        expect(Article::Redirection.last.previous_slug).to eq(@second_article.slug)
        expect(Article::Redirection.last.current_slug).to eq(@second_article.slug.sub('@', '2@'))
      end
    end

    context 'when user is connected with another current topic' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns updated article but keeping previous topic' do
        put "/api/v1/articles/#{@article.id}", params: article_attributes.deep_merge(article: { topic_id: @second_topic.id }), as: :json

        expect(response).to be_json_response

        article = JSON.parse(response.body)
        expect(article['data']['attributes']).not_to be_empty
        expect(article['data']['attributes']['topicId']).to eq(@article.topic_id)
        expect(article['data']['attributes']['topicId']).not_to eq(@second_topic.id)
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
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-@article.tagged_articles.count).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end

      it 'returns the soft deleted article id with relationships removed' do
        expect {
          delete "/api/v1/articles/#{@relation_tags_article.id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(0).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-@article.tagged_articles.count).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(-2).and change(TagRelationship.with_deleted, :count).by(0)
      end

      it 'removes permanently the draft article' do
        expect {
          delete "/api/v1/articles/#{@private_article.id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(-1)
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
        }.to change(Article, :count).by(-1).and change(Article.with_deleted, :count).by(-1).and change(Tag, :count).by(0).and change(TaggedArticle, :count).by(-@article.tagged_articles.count).and change(TaggedArticle.with_deleted, :count).by(-@article.tagged_articles.count).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end
    end
  end

  context 'comments' do
    before do
      @comments = create_list(:comment, 5, user: @other_user, commentable: @relation_tags_article_2)
    end

    let(:comment_attributes) {
      {
        comment: { title: 'title', body: 'The comment' }
      }
    }

    let(:comment_error_attributes) {
      {
        comment: { title: 'a' }
      }
    }

    let(:comment_updated_attributes) {
      {
        comment: { id: @comments.first.id, title: 'title updated', body: 'The comment updated' }
      }
    }

    describe '/api/v1/articles/:id/comments' do
      it 'returns all comments for this article' do
        get "/api/v1/articles/#{@relation_tags_article_2.id}/comments", as: :json

        expect(response).to be_json_response

        json_comments = JSON.parse(response.body)
        expect(json_comments['meta']['root']).to eq('comments')
        expect(json_comments['data']).not_to be_empty
        expect(json_comments['data'].size).to eq(5)
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
          expect(json_comment['data']['attributes']).not_to be_empty
          expect(json_comment['data']['attributes']['title']).to eq(comment_attributes[:comment][:title])
        end

        it 'returns the errors for incorrect attributes' do
          expect {
            post "/api/v1/articles/#{@relation_tags_article_2.id}/comments", params: comment_error_attributes, as: :json

            expect(response).to be_json_response(422)

            json_comment = JSON.parse(response.body)
            expect(json_comment['errors']['body'].first).to eq(I18n.t('errors.messages.blank'))
            expect(json_comment['errors']['body'].second).to eq(I18n.t('errors.messages.too_short.one', count: InRailsWeBlog.settings.comment_title_min_length))
          }.not_to change(Comment, :count)
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
          expect(json_comment['data']['attributes']).not_to be_empty
          expect(json_comment['data']['attributes']['title']).to eq(comment_updated_attributes[:comment][:title])
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
    describe '/api/v1/articles/:id/clicked' do
      it 'counts a new click on article' do
        post "/api/v1/articles/#{@relation_tags_article_2.id}/clicked", params: { user_id: @user.id, parent_id: @topic.id }, as: :json

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
