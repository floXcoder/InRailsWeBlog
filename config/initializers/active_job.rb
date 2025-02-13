# frozen_string_literal: true

file_log_path = Rails.root.join('log/jobs.log')

if Rails.env.development?
  file_logger       = Logger.new(file_log_path)
  file_logger.level = Logger::INFO

  stdout_logger = ActiveSupport::Logger.new($stdout)

  ActiveJob::Base.logger = ActiveSupport::BroadcastLogger.new(stdout_logger, file_logger)
elsif Rails.env.production?
  file_logger       = Logger.new(file_log_path)
  file_logger.level = Logger::INFO

  ActiveJob::Base.logger = file_logger
end

EXCLUDED_LOGGING_JOBS = %w[
Ahoy::GeocodeV2Job
Searchkick::ReindexV2Job
].freeze

# ActiveSupport.on_load :active_job do
module ActiveJob
  class LogSubscriber < ActiveSupport::LogSubscriber

    def enqueue(event)
      job = event.payload[:job]
      return if EXCLUDED_LOGGING_JOBS.include?(job.class.name)

      ex = event.payload[:exception_object] || job.enqueue_error

      if ex
        error do
          "Failed enqueuing #{job.class.name} to #{queue_name(event)}: #{ex.class} (#{ex.message})"
        end
      elsif event.payload[:aborted]
        info do
          "Failed enqueuing #{job.class.name} to #{queue_name(event)}, a before_enqueue callback halted the enqueuing execution."
        end
      else
        info do
          "Enqueued #{job.class.name} (Job ID: #{job.job_id}) to #{queue_name(event)}" + args_info(job)
        end
      end
    end

    def perform_start(event)
      job = event.payload[:job]
      return if EXCLUDED_LOGGING_JOBS.include?(job.class.name)

      info do
        enqueue_info = job.enqueued_at.present? ? " enqueued at #{job.enqueued_at.utc.iso8601(9)}" : ""

        "Performing #{job.class.name} (Job ID: #{job.job_id}) from #{queue_name(event)}" + enqueue_info + args_info(job)
      end
    end

    def perform(event)
      job = event.payload[:job]
      return if EXCLUDED_LOGGING_JOBS.include?(job.class.name)

      ex = event.payload[:exception_object]
      if ex
        error do
          "Error performing #{job.class.name} (Job ID: #{job.job_id}) from #{queue_name(event)} in #{event.duration.round(2)}ms: #{ex.class} (#{ex.message}):\n" + Array(ex.backtrace).join("\n")
        end
      elsif event.payload[:aborted]
        error do
          "Error performing #{job.class.name} (Job ID: #{job.job_id}) from #{queue_name(event)} in #{event.duration.round(2)}ms: a before_perform callback halted the job execution"
        end
      else
        info do
          "Performed #{job.class.name} (Job ID: #{job.job_id}) from #{queue_name(event)} in #{event.duration.round(2)}ms"
        end
      end
    end

  end
end
# end
