# frozen_string_literal: true

RSpec::Matchers.define :be_html_response do |response_value|
  match do |actual|
    @response = actual.status
    expect(actual.status).to eq(response_value || 200)
    expect(actual.content_type).to eq('text/html')
  end

  description do
    'valid HTML response'
  end

  failure_message do |model|
    "#{model} expected to be a valid HTML response (200) expected but #{@response} returned"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to be a valid HTML response (200) expected but #{@response} returned"
  end
end
