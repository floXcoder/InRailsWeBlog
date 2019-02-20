# frozen_string_literal: true

SecureHeaders::Configuration.default do |config|
  config.csp = {
    preserve_schemes: true,
    base_uri:         ["'self'"],
    default_src:      ['localhost:8080', "'self'", 'ws:', 'wss:', ENV['WEBSITE_ASSET'], 'www.youtube.com', 'vimeo.com', 'vine.com', 'www.instagram.com', 'www.dailymotion.com', 'v.youku.com'],
    connect_src:      ['localhost:8080', "'self'", 'ws:', 'wss:', ENV['WEBSITE_ASSET'], ENV['SENTRY_ADDRESS']],
    worker_src:       ["'self'"],
    script_src:       ['localhost:8080', "'self'", "'unsafe-inline'", "'unsafe-eval'", 'data:', ENV['WEBSITE_ASSET'], ENV['METRICS_ADDRESS'], ENV['SENTRY_RAVEN_ADDRESS'], ENV['NEWRELIC_ADDRESS'], ENV['NEWRELIC_SECOND_ADDRESS']],
    img_src:          ['*', 'data:'],
    font_src:         ['localhost:8080', "'self'", 'data:', ENV['WEBSITE_ASSET']],
    media_src:        ['localhost:8080', "'self'", ENV['WEBSITE_ASSET']],
    object_src:       ['localhost:8080', "'self'", ENV['WEBSITE_ASSET']],
    style_src:        ['localhost:8080', "'self'", "'unsafe-inline'", ENV['WEBSITE_ASSET']],
    form_action:      ["'self'"]
  }
end
