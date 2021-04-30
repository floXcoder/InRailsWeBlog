# frozen_string_literal: true

RSpec.configure do |config|
  config.before do
    @json_header = {
      ACCEPT: 'application/json', # This is what Rails 4 accepts
      HTTP_ACCEPT: 'application/json', # This is what Rails 3 accepts
      CONTENT_TYPE: 'application/json'
    }
  end
end
