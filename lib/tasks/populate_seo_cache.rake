# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:populate_seo_cache
  ## rails InRailsWeBlog:populate_seo_cache ALL_CACHE=true
  desc 'Populate cache for SEO'
  task :populate_seo_cache, [] => :environment do |_task, _args|
    Rails.logger       = Logger.new(STDOUT)
    Rails.logger.level = Logger::INFO

    require 'seo_cache'
    require 'seo_cache/populate_cache'

    # Change parameters in seo_cache initializer to run in development mode

    SeoCache.wait_time_for_page_loading = 1

    paths = if ENV['ALL_CACHE'].to_s == 'true'
              GenerateCacheUrls.new.all_urls
            else
              GenerateCacheUrls.new.last_modified_urls
            end

    SeoCache::PopulateCache.new(Rails.env.production? ? ENV['WEBSITE_URL'] : 'http://localhost:3000', paths, force_cache: true).perform

    Rails.logger.warn("#{Time.zone.now} : Cache pages with prerender for SEO task DONE")
  end
end
