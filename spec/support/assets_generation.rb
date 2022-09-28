# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:all, type: :feature) do
    assets_path = Rails.root.join('public/assets')
    if Dir["#{assets_path}/*"].empty?
      puts 'Generate assets...'

      %x(npm run build:test)
      %x(i18n export)
    end
  end
end
