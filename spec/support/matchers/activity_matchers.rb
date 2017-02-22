RSpec::Matchers.define :have_activity do |_value|
  match do |actual|
    expect(actual).to respond_to(:activity_owner_global, :activity_recipient_global,
                                 :activity_parameters_global, :activity_hooks, :activity_custom_fields_global)
    expect(actual).to respond_to(:public_activity_enabled_for_model)
  end

  description do
    'model activity'
  end

  failure_message do |model|
    "#{model} expected to have public activities"
  end

  failure_message_when_negated do |model|
    "#{model} expected not to have public activities"
  end
end
