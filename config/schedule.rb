# Run by whenever: add to cron table
set :output, Whenever.path + '/log/cron.log'

# noinspection RubyArgCount
every 3.days, at: '8pm', roles: [:dev] do
  rake 'InRailsWeBlog:static_analysis:all'
end

# noinspection RubyArgCount
every :month, at: '8pm', roles: [:production] do
  rake 'InRailsWeBlog:update_geolite'
end
