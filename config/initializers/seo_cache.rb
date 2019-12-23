# frozen_string_literal: true

if Rails.env.production?
  require 'seo_cache'

  SeoCache.cache_mode = Rails.env.development? ? 'memory' : 'disk'
  SeoCache.cache_path = Rails.root.join('public', 'seo_cache')

  SeoCache.chrome_path = Rails.env.production? ? '/usr/bin/chromium' : '/usr/bin/chromium-browser'

  SeoCache.redis_url = "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}"
  SeoCache.redis_namespace =  "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:seo_cache"

  SeoCache.blacklist_urls = %w[^/admin.*]
  SeoCache.blacklist_params = %w[page locale]

  SeoCache.wait_time_for_page_loading = 3

  SeoCache.logger_path = Rails.root.join('log', 'seo_cache.log')
  SeoCache.log_missed_cache = true

  Rails.application.config.middleware.use SeoCache::Middleware
end
