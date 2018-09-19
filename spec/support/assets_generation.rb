# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:all, type: :feature) do
    assets_path = Rails.root.join('public', 'assets')
    if Dir["#{assets_path}/*"].empty?
      %x(gulp development)
      %x(rails i18n:js:export)
    end
  end
end
