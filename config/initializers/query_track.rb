# frozen_string_literal: true

if Rails.env.production?
  QueryTrack::Settings.configure do |config|
    config.duration = 0.3 # seconds
    config.logs     = true
  end
end
