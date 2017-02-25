RSpec::Matchers.define :be_json_response do |response_value|
  match do |actual|
    @response = actual.status
    expect(actual.status).to eq(response_value || 200)
    expect(actual.content_type).to eq('application/json')
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
