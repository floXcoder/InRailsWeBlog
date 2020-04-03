# frozen_string_literal: true

MetaTags.configure do |config|
  config.title_limit        = 120
  config.description_limit  = 280
  config.keywords_limit     = 255
  config.keywords_separator = ', '
end
