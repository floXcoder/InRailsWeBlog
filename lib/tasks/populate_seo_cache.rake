# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Usage :
  ## rails InRailsWeBlog:populate_seo_cache
  desc "Populate cache for SEO"
  task :populate_seo_cache, [] => :environment do |_task, _args|
    Rails.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.zone.now} : Cache pages with prerender for SEO")

    require 'seo_cache'
    require 'seo_cache/populate_cache'

    paths = GenerateCacheUrls.new.all_urls

    SeoCache::PopulateCache.new(Rails.env.production? ? ENV['WEBSITE_FULL_ADDRESS'] : 'http://localhost:3000', paths).perform
  end
end
