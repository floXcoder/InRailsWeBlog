# frozen_string_literal: true

require 'rails_helper'

describe 'Comments API', type: :request do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, title: 'Article name')

    @comments = create_list(:comment, 5, user: @user, commentable: @article)
  end

  describe '/api/v1/comments' do
    it 'returns all comments' do
      get '/api/v1/comments', as: :json

      expect(response).to be_json_response

      comments = JSON.parse(response.body)

      expect(comments['meta']['root']).to eq('comments')
      expect(comments).not_to be_empty
      expect(comments['data'].size).to eq(5)
      expect(comments['meta']['pagination']['totalCount']).to eq(5)
    end
  end

end
