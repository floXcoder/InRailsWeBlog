# frozen_string_literal: true

require 'rails_helper'

describe 'Home API', type: :request do

  before(:all) do
    @user = create(:user)
  end

  describe '/ (HTML)' do
    it 'returns home page' do
      get '/'

      expect(response).to be_html_response
      expect(response.body).to match('id="react-component"')
      expect(response.body).to match('lang="en"')
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
    ensure
      I18n.locale = I18n.default_locale
    end
  end

  describe '/users/:user_slug/topics (HTML)' do
    context 'when not connected' do
      it 'returns user home page' do
        get "/users/#{@user.slug}/topics"

        expect(response).to be_html_response(302)
      end
    end

    context 'when user is connected' do
      before do
        login_as(@user, scope: :user, run_callbacks: false)
      end

      it 'returns user home page' do
        get "/users/#{@user.slug}/topics"

        expect(response).to be_html_response
        expect(response.body).to match('id="react-component"')
        expect(response.body).to match('lang="en"')
        expect(response.body).to match('data-current-user="{')
      end
    end
  end

end
