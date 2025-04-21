# frozen_string_literal: true

# Run by whenever: add to cron table
# Cron jobs are configured inside config/initializers/good_job.rb
set :output, "#{Whenever.path}/log/cron.log".sub(/releases\/\d+/, 'current')
# set :output, { error: "#{Whenever.path}/log/cron.log".sub(/releases\/\d+/, 'current'), standard: nil }

# Ensure all locale indexes are reindexed with user last article visits
every :day, at: '2am', roles: [:production] do
  rake 'InRailsWeBlog:search_reindex'
end

every :day, at: '2am', roles: [:production] do
 rake 'InRailsWeBlog:populate_seo_cache'
end

every :day, at: '2:30am', roles: [:production] do
  rake 'InRailsWeBlog:generate_sitemap'
end

every :hour, roles: [:production] do
  rake 'InRailsWeBlog:pghero_clean_query_stats'
end
every :day, at: '3am', roles: [:production] do
  rake 'InRailsWeBlog:pghero_capture_stats'
end

every :month, at: '6am', roles: [:production] do
  rake 'InRailsWeBlog:update_geolite_db'
end
