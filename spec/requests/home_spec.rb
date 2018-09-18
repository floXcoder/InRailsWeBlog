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
    end
  end

end
