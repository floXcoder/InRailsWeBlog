RSpec::Matchers.define :have_uploader do |column|
  match do |actual|
    expect(actual).to callback(:"store_#{column}!").after(:save)
    expect(actual).to callback(:"write_#{column}_identifier").before(:save)
    # expect(actual).to callback(:"store_previous_model_for_#{column}").before(:update)
    # expect(actual).to callback(:"remove_previously_stored_#{column}").after(:save)

    expect(actual).to respond_to(:read_uploader)
    expect(actual).to respond_to(:write_uploader)
  end

  description do
    'model has an uploader'
  end

  failure_message do |model|
    "#{model} expected to have uploader"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to have uploader"
  end
end
