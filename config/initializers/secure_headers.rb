# frozen_string_literal: true

SecureHeaders::Configuration.default do |config|
  config.cookies = {
    secure: true, # mark all cookies as "Secure"
    httponly: SecureHeaders::OPT_OUT, # mark all cookies as "HttpOnly"
    samesite: {
      lax: true # mark all cookies as SameSite=lax
    }
  }

  if Rails.env.development?
    config.csp = {
      preserve_schemes: true,
      base_uri:         ["'self'"],
      default_src:      ['localhost:8080', "'self'", 'ws:', 'wss:', 'www.youtube.com', 'vimeo.com', 'vine.com', 'www.instagram.com', 'www.dailymotion.com', 'v.youku.com'],
      connect_src:      ['localhost:8080', "'self'", 'ws:', 'wss:'],
      worker_src:       ["'self'"],
      script_src:       ['localhost:8080', "'self'", "'unsafe-inline'", "'unsafe-eval'", 'data:'],
      img_src:          %w[* data: blob:],
      font_src:         ['localhost:8080', "'self'", 'data:'],
      media_src:        ['localhost:8080', "'self'"],
      object_src:       ['localhost:8080', "'self'"],
      style_src:        ['localhost:8080', "'self'", "'unsafe-inline'"],
      form_action:      ["'self'"],
      frame_ancestors:  ["'none'"]
    }
  else
    config.csp = {
      preserve_schemes: true,
      base_uri:         ["'self'"],
      default_src:      ["'self'", 'ws:', 'wss:', ENV['WEBSITE_ASSET'], 'www.youtube.com', 'vimeo.com', 'vine.com', 'www.instagram.com', 'www.dailymotion.com', 'v.youku.com'].compact,
      connect_src:      ["'self'", 'ws:', 'wss:', ENV['WEBSITE_ASSET'], ENV['SENTRY_ADDRESS'], ENV['METRICS_ADDRESS']].compact,
      worker_src:       ["'self'", 'blob:'],
      script_src:       ["'self'", "'unsafe-inline'", ENV['WEBSITE_ASSET'], ENV['METRICS_ADDRESS'], ENV['SENTRY_ADDRESS']].compact,
      img_src:          %w[* data: blob:],
      font_src:         ["'self'", 'data:', ENV['WEBSITE_ASSET'], 'fonts.gstatic.com', 'github.com', 'chrome-extension'].compact,
      media_src:        ["'self'", ENV['WEBSITE_ASSET'], 'data:'].compact,
      object_src:       ["'self'", ENV['WEBSITE_ASSET']].compact,
      style_src:        ["'self'", "'unsafe-inline'", ENV['WEBSITE_ASSET'], 'translate.googleapis.com'].compact,
      child_src:        %w['self' blob:],
      form_action:      ["'self'"],
      frame_ancestors:  ["'none'"]
    }
  end
end
