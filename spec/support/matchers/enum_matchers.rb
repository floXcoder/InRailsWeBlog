RSpec::Matchers.define :have_enum do |value|
  match do |actual|
    expect(actual).to define_enum_for(value)
    expect(actual).to respond_to(:"#{value.to_s}_to_tr")
  end
end
