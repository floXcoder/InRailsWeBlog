require 'rails_helper'

describe 'Comments API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, title: 'Article name')

    @comments = create_list(:comment, 5, user: @user, commentable: @article)
  end

  describe '/comments' do
    it 'returns all comments' do
      get '/comments', as: :json

      expect(response).to be_json_response

      comments = JSON.parse(response.body)

      expect(comments).not_to be_empty
      expect(comments['comments'].size).to eq(5)
      expect(comments['meta']['total_count']).to eq(5)
    end
  end

end
