# frozen_string_literal: true

describe 'Static pages API', type: :request, basic: true do

  before(:all) do
    @user = create(:user)
  end

  describe '/robots.txt (TEXT)' do
    it 'returns the page' do
      get '/robots.txt', as: :text

      expect(response.status).to eq(200)
      expect(response.content_type).to eq('text/plain')
      expect(response.body).to match(/User-Agent/)
    end
  end

end
