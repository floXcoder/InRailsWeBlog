# frozen_string_literal: true

RSpec::Matchers.define :have_search do |model|
  match do |actual|
    expect(actual).to respond_to(:search_data)

    expect(actual.search_data).to be_a(Hash)

    expect(model).to respond_to(:searchkick_search)
    expect(model).to respond_to(:searchkick_reindex)
    expect(model).to respond_to(:reindex)
  end

  description do
    'model have search'
  end

  failure_message do |model_name|
    "#{model_name} expected to have search methods"
  end

  failure_message_when_negated do |model_name|
    "#{model_name} expected not to have search methods"
  end
end
