# frozen_string_literal: true

if Rails.env.production?
  require 'seo_cache'

  SeoCache.cache_mode = 'disk'
  SeoCache.disk_cache_path = Rails.root.join('public', 'seo_cache')

  SeoCache.redis_url = "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}"
  SeoCache.redis_namespace =  "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:seo_cache"

  SeoCache.blacklist_urls = %w[^/admin.*]

  SeoCache.blacklist_params = %w[page locale]

  SeoCache.log_missed_cache = true

  # SeoCache.prerender_service_url = ENV['PRERENDER_SERVICE_URL'] || 'http://localhost:3010'

  Rails.application.config.middleware.use SeoCache::Middleware
end
