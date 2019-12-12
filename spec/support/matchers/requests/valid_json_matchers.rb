# frozen_string_literal: true

RSpec::Matchers.define :be_json_response do |response_value|
  match do |actual|
    @response = actual.status
    expect(actual.media_type).to eq('application/json') unless @response == 204
    expect(actual.status).to eq(response_value || 200)
  end

  description do
    'valid json response'
  end

  failure_message do |model|
    "#{model} expected to be a valid json response: #{response_value} expected but #{@response} returned"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to be a valid json response: #{response_value} expected but #{@response} returned"
  end
end
