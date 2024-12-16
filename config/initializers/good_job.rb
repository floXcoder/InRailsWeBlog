# frozen_string_literal: true

Rails.application.configure do
  # Configuration options: https://github.com/bensheldon/good_job?tab=readme-ov-file#configuration-options

  config.good_job.preserve_job_records                      = true
  config.good_job.cleanup_preserved_jobs_before_seconds_ago = 1.month
  # config.good_job.cleanup_interval_jobs = 1_000 # Number of executed jobs between deletion sweeps.
  # config.good_job.cleanup_interval_seconds = 10.minutes # Number of seconds between deletion sweeps.

  config.good_job.retry_on_unhandled_error = false

  config.good_job.smaller_number_is_higher_priority = false

  config.good_job.queues = '*'

  config.good_job.max_threads = 5

  # Only for async configuration
  config.good_job.poll_interval    = 5 # seconds
  config.good_job.shutdown_timeout = 30 # seconds

  config.good_job.dashboard_default_locale = I18n.default_locale

  config.good_job.enable_cron = true
  config.good_job.cron        = {
    update_tracker: {
      cron: '*/15 * * * *', # Every 15 minutes
      class:              'UpdateTrackerJob',
      enabled_by_default: -> { Rails.env.production? }
    },
    clean_unused_tags:    {
      cron: '0 1 * * *', # Every day
      class:              'UnusedTagsJob',
      enabled_by_default: -> { Rails.env.production? }
    },
    clean_orphan_pictures:    {
      cron: '0 2 * * *', # Every day
      class:              'CleanUploadsJob',
      enabled_by_default: -> { Rails.env.production? }
    },
    clean_visits:   {
      cron: '0 5 * * 0', # Every week at 5am
      class:              'CleanVisitsJob',
      enabled_by_default: -> { Rails.env.production? }
    }
  }
end