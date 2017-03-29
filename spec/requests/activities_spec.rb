require 'rails_helper'

describe 'Activities API', type: :request, basic: true do

  before(:all) do
    @user  = create(:user)
    @admin = create(:admin)

    @topic = create(:topic, user: @user)

    @article = create(:article, user: @user, topic: @topic, title: 'Article name')

    @article.create_activity(:update, owner: @user)
    @article.create_activity(:update, owner: @user)
    @article.create_activity(:update, owner: @user)
  end

  describe '/activities' do
    context 'when admin is not connected' do
      it 'returns an error message' do
        get '/activities', as: :json

        expect(response).to be_json_response

        activities = JSON.parse(response.body)

        expect(activities['status']).to eq(404)
      end
    end

    context 'when admin is connected' do
      before do
        login_as(@admin, scope: :admin, run_callbacks: false)
      end

      it 'returns all POIs associated to the ride' do
        get '/activities', as: :json

        expect(response).to be_json_response

        activities = JSON.parse(response.body)

        expect(activities).not_to be_empty
        # expect(activities.size).to eq(5)
        expect(activities.first['key']).to eq('article.update')
      end
    end
  end

end
