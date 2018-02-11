# Display source of SQL requests
if Rails.env.development? && Rails.configuration.x.log_sql_source
  ActiveSupport::Notifications.subscribe('sql.active_record') do |_, _, _, _, details|
    # SQL request:
    # details[:sql]

    relevant_caller_line = caller.detect do |caller_line|
      caller_line.include?(Rails.root.to_s) && !caller_line.include?('bin/rails') && !caller_line.include?('initializers')
    end

    if relevant_caller_line
      Rails.logger.debug("  ↳ #{relevant_caller_line.sub("#{Rails.root}/", '')}")
    end
  end
end
