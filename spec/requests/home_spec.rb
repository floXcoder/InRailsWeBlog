# frozen_string_literal: true

require 'rails_helper'

describe 'Home API', type: :request, basic: true do

  before(:all) do
  end

  describe '/ (HTML)' do
    it 'returns home page' do
      get '/'

      expect(response).to be_html_response
      expect(response.body).to match('id="home-component"')
      expect(response.body).to match('lang="en"')
      expect(response.body).to match("'en'")
    end

    context 'when seo data are changed' do
      before do
        Seo::Data.create(name: 'home_en', locale: 'en', page_title: 'Home title', meta_desc: 'Meta-desc description')
      end

      it 'returns home page with new seo data' do
        get '/'

        expect(response).to be_html_response
        expect(response.body).to match('Home title')
        expect(response.body).to match('Meta-desc description')
      end
    end
  end

  describe '/fr (HTML)' do
    it 'returns home page in french' do
      get '/fr'

      expect(response).to be_html_response
      expect(response.body).to match('lang="fr"')
      expect(response.body).to match("'fr'")
    ensure
      I18n.locale = I18n.default_locale
    end
  end

  describe '/de (HTML)' do
    it 'returns home page in german' do
      get '/de'

      expect(response).to be_html_response
      expect(response.body).to match('lang="de"')
      expect(response.body).to match("'de'")
    ensure
      I18n.locale = I18n.default_locale
    end
  end

  describe '/es (HTML)' do
    it 'returns home page in spanish' do
      get '/es'

      expect(response).to be_html_response
      expect(response.body).to match('lang="es"')
      expect(response.body).to match("'es'")
    ensure
      I18n.locale = I18n.default_locale
    end
  end

  describe '/it (HTML)' do
    it 'returns home page in italian' do
      get '/it'

      expect(response).to be_html_response
      expect(response.body).to match('lang="it"')
      expect(response.body).to match("'it'")
    ensure
      I18n.locale = I18n.default_locale
    end
  end

end
