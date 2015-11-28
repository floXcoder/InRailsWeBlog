set :output, './log/cron.log'

# noinspection RubyArgCount
every 3.days, at: '8pm' do
  rake 'InRailsWeBlog:static_analysis:all'
end

# noinspection RubyArgCount
every :month, at: '8pm' do
  rake 'InRailsWeBlog:update_geolite'
end
