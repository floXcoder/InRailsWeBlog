# frozen_string_literal: true

RSpec::Matchers.define :be_unauthenticated do |_value|
  match do |actual|
    expect(actual.status).to eq(403)
    expect(actual.content_type).to eq('application/json')

    response_json = JSON.parse(actual.body)

    expect(response_json['errors']).not_to be_empty
    expect(response_json['errors']).to eq(I18n.t('devise.failure.unauthenticated'))
  end

  description do
    'check unauthorized json response'
  end

  failure_message do |model|
    "#{model} expected to be unauthenticated json response"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to be authenticated json response"
  end
end
