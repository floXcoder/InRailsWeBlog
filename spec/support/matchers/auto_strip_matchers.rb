# frozen_string_literal: true

RSpec::Matchers.define :have_strip_attributes do |columns|
  match do |actual|
    columns.each do |column|
      value_with_extra_spaces = '  \r test \n  '
      actual.update(column => value_with_extra_spaces)
      returned_value = actual.send(column)
      expect(returned_value).to eq(value_with_extra_spaces.strip)
    end
  end

  description do
    'model auto strips selected attributes'
  end

  failure_message do |model|
    "#{model} expected to have auto strip"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to auto strip"
  end
end
