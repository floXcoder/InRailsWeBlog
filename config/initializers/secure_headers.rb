SecureHeaders::Configuration.default do |config|
  config.csp = {
    report_only:      false,
    preserve_schemes: true,
    default_src:      %w('self' ws:),
    child_src:        %w('self'),
    script_src:       ["'self'", "'unsafe-inline'", "'unsafe-eval'", "data:", ENV['METRICS_ADDRESS']],
    img_src:          ["'self'", 'data:', ENV['METRICS_ADDRESS']],
    font_src:         %w('self'),
    media_src:        %w('self'),
    object_src:       %w('self'),
    style_src:        %w('unsafe-inline' 'self'),
    form_action:      %w('self')
  }
end
