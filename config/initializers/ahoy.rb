# frozen_string_literal: true

class Ahoy::Store < Ahoy::DatabaseStore
  def track_visit(data)
    super(data)
  end

  def track_event(data)
    super(data)
  end

  def geocode(data)
    super(data)
  end

  def authenticate(data)
    super(data)
  end
end

# Custom User Method
Ahoy.user_method = :current_user

# Set to true for JavaScript tracking
Ahoy.api = false

# Exclude bots from tracking
Ahoy.track_bots = false

# Better user agent parsing
Ahoy.user_agent_parser = :device_detector

# Defer create visits
Ahoy.server_side_visits = :when_needed

# By default, a new visit is created after 12 hours of inactivity
Ahoy.visit_duration = 12.hours

# Enabled geocoding
Ahoy.geocode = ENV['DISABLE_AHOY_GEOCODING'] ? false : true

# Queue name for geocoding
Ahoy.job_queue = :ahoy

# For debug
Ahoy.quiet = true

# Do not log ahoy basic events
if Rails.env.production?
  Ahoy.logger = Logger.new('log/sidekiq.log')
  Ahoy.logger.level = Logger::WARN
end

# Improve bot detection
Ahoy.bot_detection_version = 2

# Limit cookies to 1 year
Ahoy.visitor_duration = 1.year
Ahoy.cookie_options   = { expires: 1.year }

# Print exceptions
Safely.report_exception_method = ->(error) { Rails.logger.error(error) }

EXCLUDE_IPS         = if File.exists?(Rails.root.join('lib/tracking/excluded_pattern_ips.txt'))
                        File.open(Rails.root.join('lib/tracking/excluded_pattern_ips.txt')) { |file| file.readlines.map(&:chomp) }
                      else
                        []
                      end
EXCLUDE_PATTERN_IPS = if File.exists?(Rails.root.join('lib/tracking/excluded_ips.txt'))
                        File.open(Rails.root.join('lib/tracking/excluded_ips.txt')) { |file| file.readlines.map(&:chomp) }
                      else
                        []
                      end

# Exclude asset requests and admin from visits
Ahoy.exclude_method = lambda do |_controller, request|
  # return true if ENV['TRACKER_EXCLUDED_IP'].split(', ').include?(request&.ip)

  return true if EXCLUDE_PATTERN_IPS.any? { |ip| request&.ip&.include?(ip) } || EXCLUDE_IPS.any? { |ip| request&.ip&.include?(ip) }

  return %w[/assets/ /uploads/ .php ?php .js .aspx .sql .gz .bz2 .xz .txt .xml .css .gif .png .jpg .jpeg .ico .abe .start].any? { |path| request&.path&.include?(path) }
end
