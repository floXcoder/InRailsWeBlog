set :output, './log/cron.log'

every 3.days do
  rake 'InRailsWeBlog:static_analysis:all'
end

every :month do
  rake 'InRailsWeBlog:update_geolite'
end
