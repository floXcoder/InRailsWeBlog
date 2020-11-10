# frozen_string_literal: true

require 'rails_helper'

describe 'Tag API', type: :request, basic: true do

  before(:all) do
    @user       = create(:user)
    @other_user = create(:user)
    @admin      = create(:admin)

    @topic       = create(:topic, user: @user)
    @other_topic = create(:topic, user: @user)

    @tags         = create_list(:tag, 5, user: @user)
    @private_tags = create_list(:tag, 5, user: @user, visibility: 'only_me')

    @article = create(:article, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
    @article = create(:article, user: @user, topic: @other_topic, tags: [@private_tags[0], @private_tags[1], @private_tags[2]])
  end

  let(:tag_attributes) {
    {
      tag: { name: 'name', description: 'description' }
    }
  }
  let(:updated_tag_attributes) {
    {
      tag: { name: 'name title', description: 'new description' }
    }
  }
  let(:tag_error_attributes) {
    {
      tag: tag_attributes.merge(
        name: 'name' * 30
      )
    }
  }

  describe '/tags (HTML)' do
    it 'returns all public tags' do
      get '/tags'

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
      expect(response.body).to match('data-tags="{')
    end
  end

  describe '/tags/:id (HTML)' do
    it 'returns the public tags' do
      get "/tags/#{@tags[0].slug}"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
      expect(response.body).to match('data-tag="{')
    end
  end

  describe '/tags/:id/edit (HTML)' do
    before do
      login_as(@user, scope: :user, run_callbacks: false)
    end

    it 'returns the tag for editing' do
      get "/tags/#{@tags[0].slug}"

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
      expect(response.body).to match('data-tag="{')
    end
  end

  describe '/api/v1/tags' do
    context 'when no parameters and not connected' do
      it 'returns all public tags' do
        get '/api/v1/tags', as: :json

        expect(response).to be_json_response

        json_tags = JSON.parse(response.body)

        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data']).not_to be_empty
        expect(json_tags['data'].size).to eq(5)

        tags_visibility = json_tags['data'].map { |m| m['attributes']['visibility'] }
        expect(tags_visibility).to match_array(['everyone'] * 5)
      end

      it 'limits the number of tags' do
        create_list(:tag, 10, user: @user)

        get '/api/v1/tags', params: { limit: 5 }, as: :json

        json_tags = JSON.parse(response.body)

        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data']).not_to be_empty
        expect(json_tags['data'].size).to equal(5)
      end
    end

    context 'when no parameters and owner is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns all public and private tags for current user' do
        get '/api/v1/tags', as: :json

        expect(response).to be_json_response

        json_tags = JSON.parse(response.body)

        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data']).not_to be_empty
        expect(json_tags['data'].size).to eq(Tag.from_user_id(@user.id, @user.id).count)

        tags_visibility = json_tags['data'].map { |m| m['attributes']['visibility'] }
        expect(tags_visibility).to match_array(['everyone'] * 5 + ['only_me'] * 5)
      end
    end

    context 'when filtering tags' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns tags for ids' do
        get '/api/v1/tags', params: { filter: { tag_ids: [@tags[0].id, @tags[1].id] } }, as: :json
        json_tags = JSON.parse(response.body)
        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data'].size).to eq(2)
      end

      it 'returns tags for topic of user' do
        get '/api/v1/tags', params: { filter: { user_id: @user.id, topic_id: @topic.id } }, as: :json
        json_tags = JSON.parse(response.body)
        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data'].size).to eq(3)
      end

      it 'returns bookmarked tags for current user' do
        get '/api/v1/tags', params: { filter: { bookmarked: true } }, as: :json
        json_tags = JSON.parse(response.body)
        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data']).to be_empty
      end
    end

    context 'when fetching tags in database' do
      it 'limits the number of database queries' do
        expect {
          get '/api/v1/tags', params: { filter: { user_id: @user.id }, limit: 20 }, as: :json
        }.to make_database_queries(count: 3..6)
      end
    end

    context 'when lot of tag' do
      let!(:articles) { create_list(:tag, 200, user: @user) }

      it 'returns all tags in less than 0.4 seconds' do
        expect {
          get '/api/v1/tags', params: { filter: { user_id: @user.id }, limit: 1_000 }, as: :json
        }.to take_less_than(0.45).seconds
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all public tags' do
        get '/api/v1/tags', as: :json

        json_tags = JSON.parse(response.body)
        expect(json_tags['meta']['root']).to eq('tags')
        expect(json_tags['data']).not_to be_empty
        expect(json_tags['data'].size).to eq(Tag.everyone.count)
      end
    end
  end

  describe '/api/v1/tags/:id' do
    context 'when user is not connected but tag is private' do
      it 'returns an error message' do
        get "/api/v1/tags/#{@private_tags[0].id}", as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when another user is connected but tag is private' do
      before do
        login_as(@other_user, scope: :user, run_callbacks: false)
      end

      it 'returns an error message' do
        get "/api/v1/tags/#{@private_tags[0].id}", params: { user_id: @private_tags[0].user.slug }, as: :json

        expect(response).to be_unauthorized
      end
    end

    context 'when user is connected and tag is private' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the associated tag' do
        get "/api/v1/tags/#{@private_tags[0].id}", params: { user_id: @private_tags[0].user.slug }, as: :json

        expect(response).to be_json_response

        tag = JSON.parse(response.body)
        expect(tag['data']['attributes']).not_to be_empty
        expect(tag['data']['attributes']['name']).to eq(@private_tags[0].name)
      end
    end

    context 'when tag is public' do
      it 'returns the associated tag' do
        get "/api/v1/tags/#{@tags[0].id}", params: { user_id: @tags[0].user.slug }, as: :json

        expect(response).to be_json_response

        tag = JSON.parse(response.body)
        expect(tag['data']['attributes']).not_to be_empty
        expect(tag['data']['attributes']['name']).to eq(@tags[0].name)
      end
    end
  end

  describe '/api/v1/tags (PUT)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        put "/api/v1/tags/#{@tags[0].id}", params: tag_attributes, as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the updated tag' do
        expect {
          put "/api/v1/tags/#{@private_tags[0].id}", params: updated_tag_attributes, as: :json

          expect(response).to be_json_response

          tag = JSON.parse(response.body)
          expect(tag['data']['attributes']).not_to be_empty
          expect(tag['data']['attributes']['name']).to eq(updated_tag_attributes[:tag][:name])
          expect(tag['data']['attributes']['description']).to eq(updated_tag_attributes[:tag][:description])
        }.not_to change(Tag, :count)
      end

      context 'when updating a tag with errors' do
        before do
          login_as(@user, scope: :user, run_callbacks: false)
        end

        it 'returns the errors' do
          expect {
            put "/api/v1/tags/#{@tags[0].id}", params: tag_error_attributes, as: :json

            expect(response).to be_json_response(422)

            tag = JSON.parse(response.body)
            expect(tag['errors']['name'].first).to eq(I18n.t('errors.messages.too_long.other', count: InRailsWeBlog.config.tag_name_max_length))
            expect(tag['errors']['name'].second).to eq(I18n.t('activerecord.errors.models.tag.public_name_immutable'))
          }.not_to change(Tag, :count)
        end
      end
    end
  end

  describe '/api/v1/tags/:id (DELETE)' do
    context 'when user is not connected' do
      it 'returns an error message' do
        delete "/api/v1/tags/#{@tags[0].id}", as: :json

        expect(response).to be_unauthenticated
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns the soft deleted tag id' do
        expect {
          delete "/api/v1/tags/#{@tags[4].id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Tag, :count).by(-1).and change(Tag.with_deleted, :count).by(0).and change(TaggedArticle, :count).by(0).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end

      it 'returns the soft deleted tag id with relationships removed' do
        expect {
          delete "/api/v1/tags/#{@tags[0].id}", as: :json

          expect(response).to be_json_response(204)
        }.to change(Tag, :count).by(-1).and change(Tag.with_deleted, :count).by(0).and change(TaggedArticle, :count).by(-1).and change(TaggedArticle.with_deleted, :count).by(0).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'can remove permanently an tag' do
        expect {
          delete "/api/v1/tags/#{@tags[2].id}", as: :json, params: { permanently: true }

          expect(response).to be_json_response(204)
        }.to change(Tag, :count).by(-1).and change(Tag.with_deleted, :count).by(-1).and change(TaggedArticle, :count).by(-1).and change(TaggedArticle.with_deleted, :count).by(-1).and change(TagRelationship, :count).by(0).and change(TagRelationship.with_deleted, :count).by(0)
      end
    end
  end

  context 'comments' do
    before(:all) do
      @comments       = create_list(:comment, 5, user: @other_user, commentable: @tags.first)
      @other_comments = create_list(:comment, 5, user: @other_user, commentable: @tags.second)
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

    describe '/api/v1/tags/:id/comments' do
      it 'returns all comments for this tag' do
        get "/api/v1/tags/#{@tags.first.id}/comments", as: :json

        expect(response).to be_json_response

        json_comments = JSON.parse(response.body)
        expect(json_comments['data']).not_to be_empty
        expect(json_comments['data'].size).to eq(5)
      end
    end

    describe '/api/v1/tags/:id/comments (POST)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          post "/api/v1/tags/#{@tags.first.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'creates a new comment associated to this tag' do
          post "/api/v1/tags/#{@tags.first.id}/comments", params: comment_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['data']['attributes']).not_to be_empty
          expect(json_comment['data']['attributes']['title']).to eq(comment_attributes[:comment][:title])
        end
      end
    end

    describe '/api/v1/tags/:id/comments (PUT)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          put "/api/v1/tags/#{@tags.first.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'updates a comment associated to this tag' do
          put "/api/v1/tags/#{@tags.first.id}/comments", params: comment_updated_attributes, as: :json

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['data']['attributes']).not_to be_empty
          expect(json_comment['data']['attributes']['title']).to eq(comment_updated_attributes[:comment][:title])
        end
      end
    end

    describe '/api/v1/tags/:id/comments (DELETE)' do
      context 'when user is not connected' do
        it 'returns an error message' do
          delete "/api/v1/tags/#{@tags.first.id}/comments", as: :json, params: { comment: { id: @comments.second.id } }

          expect(response).to be_unauthenticated
        end
      end

      context 'when user is connected' do
        before do
          login_as(@other_user, scope: :user, run_callbacks: false)
        end

        it 'deletes a comment associated to this tag' do
          delete "/api/v1/tags/#{@tags.first.id}/comments", as: :json, params: { comment: { id: @comments.second.id } }

          expect(response).to be_json_response(202)

          json_comment = JSON.parse(response.body)
          expect(json_comment['deletedCommentIds']).not_to be_empty
          expect(json_comment['deletedCommentIds'].first).to eq(@comments.second.id)
        end
      end
    end
  end

  context 'tracker' do
    describe '/api/v1/tags/:id/clicked' do
      it 'counts a new click on tags' do
        post "/api/v1/tags/#{@tags.first.id}/clicked", params: { user_id: @user.id, parent_id: @topic.id }, as: :json

        expect(response).to be_json_response(204)
      end
    end

    describe '/api/v1/tags/:id/viewed' do
      it 'counts a new view on tags' do
        post "/api/v1/tags/#{@tags.second.id}/viewed", as: :json

        expect(response).to be_json_response(204)
      end
    end
  end

end
