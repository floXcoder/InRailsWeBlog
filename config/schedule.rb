# frozen_string_literal: true

# Run by whenever: add to cron table
set :output, Whenever.path + '/log/cron.log'

# noinspection RubyArgCount
every 3.days, at: '8pm', roles: [:test] do
  rake 'InRailsWeBlog:static_analysis:all'
end

# noinspection RubyArgCount
every :month, at: '8pm', roles: [:production] do
  rake 'InRailsWeBlog:update_geolite'
end

# noinspection RubyArgCount
every :day, at: '11pm', roles: [:production] do
  rake 'InRailsWeBlog:populate_seo_cache'
end
