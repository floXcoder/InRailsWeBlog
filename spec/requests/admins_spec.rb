# frozen_string_literal: true

require 'rails_helper'

describe 'Admins API', type: :request, basic: true do

  before(:all) do
    @admin = create(:admin)
  end

  describe '/admin (HTML)' do
    before do
      login_as(@admin, scope: :admin, run_callbacks: false)
    end

    it 'returns the page' do
      get '/admin'

      expect(response).to be_html_response
      expect(response.body).to match('id="admin-dashboard-component"')
    end
  end

end
