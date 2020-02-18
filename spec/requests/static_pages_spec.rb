# frozen_string_literal: true

describe 'Static pages API', type: :request, basic: true do

  before(:all) do
    @user = create(:user)
  end

  describe '/meta-tags (JSON)' do
    before do
      Seo::Data.create(name: 'about_en', locale: 'en', page_title: 'About title', meta_desc: 'Meta-desc description')
    end

    it 'returns the seo data of the route' do
      get '/meta-tags', params: { route_name: 'about' }, as: :json

      expect(response).to be_json_response

      meta_tags = JSON.parse(response.body)
      expect(meta_tags['metaTags']['title']).to include('About title')
      expect(meta_tags['metaTags']['description']).to eq('Meta-desc description')
    end
  end

  describe '/robots.txt (TEXT)' do
    it 'returns the page' do
      get '/robots.txt', as: :text

      expect(response.status).to eq(200)
      expect(response.media_type).to eq('text/plain')
      expect(response.body).to match(/User-Agent/)
    end
  end

end
