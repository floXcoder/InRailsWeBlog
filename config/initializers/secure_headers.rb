SecureHeaders::Configuration.default do |config|
  config.csp = {
    preserve_schemes: true,
    base_uri:         %w['self'],
    default_src:      %w[localhost:8080 'self' ws: wss: assets.inrailsweblog.com *.l-x.fr],
    connect_src:      %w[localhost:8080 'self' ws: wss: assets.inrailsweblog.com *.l-x.fr],
    worker_src:       %w['self'],
    script_src:       ['localhost:8080', "'self'", "'unsafe-inline'", "'unsafe-eval'", 'data:', ENV['METRICS_ADDRESS'], ENV['NEWRELIC_ADDRESS']],
    img_src:          %w[* data:],
    font_src:         %w[localhost:8080 'self' assets.inrailsweblog.com *.l-x.fr data:],
    media_src:        %w[localhost:8080 'self' assets.inrailsweblog.com *.l-x.fr],
    object_src:       %w[localhost:8080 'self' assets.inrailsweblog.com *.l-x.fr],
    style_src:        %w[localhost:8080 'unsafe-inline' 'self' assets.inrailsweblog.com *.l-x.fr],
    form_action:      %w['self']
  }
end
