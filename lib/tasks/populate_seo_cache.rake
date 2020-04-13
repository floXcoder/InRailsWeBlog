# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:populate_seo_cache
  ## rails InRailsWeBlog:populate_seo_cache ALL_CACHE=true
  desc "Populate cache for SEO"
  task :populate_seo_cache, [] => :environment do |_task, _args|
    Rails.logger       = Logger.new(STDOUT)
    Rails.logger.level = Logger::WARN
    Rails.logger.warn("#{Time.now} : Cache pages with prerender for SEO task")

    require 'seo_cache'
    require 'seo_cache/populate_cache'

    paths = if ENV['ALL_CACHE']
              GenerateCacheUrls.new.all_urls
            else
              GenerateCacheUrls.new.last_modified_urls
            end

    SeoCache::PopulateCache.new(Rails.env.production? ? ENV['WEBSITE_FULL_ADDRESS'] : 'http://localhost:3000', paths, force_cache: true).perform
  end
end
