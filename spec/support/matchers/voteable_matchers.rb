# frozen_string_literal: true

RSpec::Matchers.define :acts_as_voteable do |model|
  match do |actual|
    expect(actual).to have_many(:votes)

    expect(actual).to respond_to(:votes_for)
    expect(actual).to respond_to(:votes_against)
    expect(actual).to respond_to(:percent_for)
    expect(actual).to respond_to(:percent_against)
    expect(actual).to respond_to(:votes_count)
    expect(actual).to respond_to(:voted_by?)

    expect(model).to respond_to(:plusminus_tally)
    expect(model).to respond_to(:tally)
  end

  description do
    'model acts as voteable'
  end

  failure_message do |model_name|
    "#{model_name} expected to have voteable methods"
  end

  failure_message_when_negated do |model_name|
    "#{model_name} expected not to have voteable methods"
  end
end
