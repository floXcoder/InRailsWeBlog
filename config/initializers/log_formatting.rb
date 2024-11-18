# frozen_string_literal: true

class ActiveSupport::Logger::SimpleFormatter
  SEVERITY_TO_TAG_MAP = {
    'DEBUG'   => 'debug',
    'INFO'    => 'info',
    'WARN'    => 'warn',
    'ERROR'   => 'ERROR',
    'FATAL'   => 'FATAL',
    'UNKNOWN' => 'UNKNOWN'
  }.freeze

  SEVERITY_TO_COLOR_MAP = {
    'DEBUG' => '0;37',
    'INFO'  => '32', # White text
    'WARN'  => '33', # Yellow text
    'ERROR' => '31', # Bold Red text
    'FATAL' => '31', # Bold Red text
    'UNKNOWN' => '37'
  }.freeze

  USE_HUMOROUS_SEVERITIES = true

  def call(severity, time, _progname, msg)
    formatted_severity = if USE_HUMOROUS_SEVERITIES
                           format('%-3s', SEVERITY_TO_TAG_MAP[severity])
                         else
                           format('%-5s', severity)
                         end

    color = SEVERITY_TO_COLOR_MAP[severity]

    if Rails.env.development?
      formatted_time = time.strftime('%H:%M:%S.') << time.usec.to_s[0..2].rjust(3)

      if %w[ERROR FATAL].include?(severity)
        "\033[0;37m#{formatted_time}\033[0m \033[#{color}m[#{formatted_severity}] #{msg.respond_to?(:strip) ? msg.strip : msg}\033[0m\n"
      else
        "\033[0;37m#{formatted_time}\033[0m [\033[#{color}m#{formatted_severity}\033[0m] #{msg.respond_to?(:strip) ? msg.strip : msg}\n"
      end
    else
      formatted_time = time.strftime('%Y-%m-%d %H:%M:%S.') << time.usec.to_s[0..2].rjust(3)

      "#{formatted_time} [\033[#{color}m#{formatted_severity}\033[0m] #{msg.respond_to?(:strip) ? msg.strip : msg} (pid:#{$PROCESS_ID})\n"
    end
  end
end
