# frozen_string_literal: true

describe 'Static pages API', type: :request, basic: true do

  # before(:all) do
  # end

  describe '/about (HTML)' do
    it 'returns about page' do
      get '/'

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
    end
  end

  describe '/terms (HTML)' do
    it 'returns terms page' do
      get '/'

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
    end
  end

  describe '/privacy (HTML)' do
    it 'returns privacy page' do
      get '/'

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match('<title>')
      expect(response.body).to match('<meta name="description"')
    end
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

  describe '/not_found' do
    it 'returns the not found page as HTML' do
      get '/not_found'

      expect(response.status).to eq(404)
      expect(response.media_type).to eq('text/html')
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
    end

    it 'returns the not found page as JSON' do
      get '/not_found', as: :json

      expect(response.status).to eq(404)
      expect(response.media_type).to eq('application/json')
      not_found = JSON.parse(response.body)
      expect(not_found['errors']).to eq(t('views.error.status.explanation.404'))
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
