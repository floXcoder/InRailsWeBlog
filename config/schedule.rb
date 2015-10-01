set :output, './log/cron.log'

every 3.days do
  rake 'static_analyzer:all'
end
