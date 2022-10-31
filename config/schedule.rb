# frozen_string_literal: true

# Run by whenever: add to cron table
set :output, "#{Whenever.path}/log/cron.log"

every 15.minutes, roles: [:production] do
  # InRailsWeBlog.settings.tracker_cron
  rake 'InRailsWeBlog:update_tracker_data'
end

every :day, at: '1am', roles: [:production] do
  rake 'InRailsWeBlog:remove_unused_tags'
end

every :day, at: '1:30am', roles: [:production] do
  rake 'InRailsWeBlog:clean_orphan_pictures'
end

# Ensure all locale indexes are reindexed
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

every :week, at: '5am', roles: [:production] do
  rake 'InRailsWeBlog:clean_visits'
end

every :month, at: '6am', roles: [:production] do
  rake 'InRailsWeBlog:update_geolite_db'
end

