# frozen_string_literal: true

module Features
  module SidekiqHelpers
    def process_email
      Sidekiq::Extensions::DelayedMailer.drain
    end

    def process_async(task_name)
      task_name.class.send(:drain)
      # EventWorker.drain
    end
  end
end
