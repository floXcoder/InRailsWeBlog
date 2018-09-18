# frozen_string_literal: true

RSpec::Matchers.define :have_friendly_id do |value|
  match do |actual|
    expect(actual).to respond_to(value)

    expect(actual).to respond_to(:slug_candidates)
    expect(actual.slug_candidates).to be_a(Array)

    expect(actual).to validate_uniqueness_of(value).case_insensitive
    expect(actual).to have_db_index(value)
  end
end
