RSpec::Matchers.define :act_as_tracked do |model|
  match do |actual|
    expect(actual).to have_one(:tracker)
    expect(actual).to accept_nested_attributes_for(:tracker)
    expect(actual).to callback(:create_tracker).after(:create)

    expect(actual).to delegate_method(:popularity).to(:tracker)
    expect(actual).to delegate_method(:rank).to(:tracker)
    expect(actual).to delegate_method(:home_page).to(:tracker)

    expect(actual).to respond_to(:tracked_name)
    expect(actual).to respond_to(:tracker_metrics)

    expect(model).to respond_to(:acts_as_tracked)
    expect(model).to respond_to(:track_searches)
    expect(model).to respond_to(:track_clicks)
    expect(model).to respond_to(:track_views)

    expect(model).to respond_to(:most_viewed)
    expect(model).to respond_to(:most_clicked)
    expect(model).to respond_to(:recently_tracked)
  end

  description do
    'model acts as tracked'
  end

  failure_message do |model_name|
    "#{model_name} expected to have tracker methods"
  end

  failure_message_when_negated do |model_name|
    "#{model_name} expected not to have tracker methods"
  end
end
