SecureHeaders::Configuration.default do |config|
  config.csp = {
    preserve_schemes: true,
    default_src:      %w['self' ws: wss: *.l-x.fr],
    connect_src:      %w['self' ws: wss: *.l-x.fr],
    child_src:        %w['self'],
    script_src:       ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'data:', ENV['METRICS_ADDRESS']],
    img_src:          ["'self'", 'data:', ENV['METRICS_ADDRESS']],
    font_src:         %w['self' *.l-x.fr data:],
    media_src:        %w['self' *.l-x.fr],
    object_src:       %w['self' *.l-x.fr],
    style_src:        %w['unsafe-inline' 'self' *.l-x.fr],
    form_action:      %w['self']
  }
end
