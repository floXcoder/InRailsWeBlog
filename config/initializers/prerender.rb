# frozen_string_literal: true

if Rails.env.production? && ENV['PRERENDER_ACTIVE']
  @page_caching = PageCaching.new(Rails.root.join('public', 'prerender_cache'), '.html')

  Rails.application.config.middleware.use Rack::Prerender,
                                          prerender_service_url: 'http://localhost:3010',
                                          # before_render:         (Proc.new do |env|
                                          #   @redis.get(Rack::Request.new(env).url)
                                          # end),
                                          after_render:          (Proc.new do |env, response|
                                            @page_caching.cache(response.body, Rack::Request.new(env).path)
                                          end)
end
