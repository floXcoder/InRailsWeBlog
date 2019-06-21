# frozen_string_literal: true

class ActiveSupport::Logger::SimpleFormatter
  SEVERITY_TO_TAG_MAP   = { 'DEBUG' => 'debug', 'INFO' => 'info', 'WARN' => 'warn', 'ERROR' => 'ERROR', 'FATAL' => 'FATAL', 'UNKNOWN' => 'UNKNOWN' }.freeze
  SEVERITY_TO_COLOR_MAP = { 'DEBUG' => '0;37', 'INFO' => '32', 'WARN' => '33', 'ERROR' => '31', 'FATAL' => '31', 'UNKNOWN' => '37' }.freeze

  USE_HUMOROUS_SEVERITIES = true

  def call(severity, time, _progname, msg)
    formatted_severity = if USE_HUMOROUS_SEVERITIES
                           format('%-3s', SEVERITY_TO_TAG_MAP[severity])
                         else
                           format('%-5s', severity)
                         end

    formatted_time = time.strftime('%Y-%m-%d %H:%M:%S.') << time.usec.to_s[0..2].rjust(3)
    color          = SEVERITY_TO_COLOR_MAP[severity]

    "\033[0;37m#{formatted_time}\033[0m [\033[#{color}m#{formatted_severity}\033[0m] #{msg.strip} (pid:#{$$})\n"
  end
end
