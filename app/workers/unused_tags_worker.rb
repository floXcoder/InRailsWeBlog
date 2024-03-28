# frozen_string_literal: true

class UnusedTagsWorker
  include Sidekiq::Job

  sidekiq_options queue: :default

  def perform
    Tag.unused.find_in_batches(batch_size: 200) do |tags|
      Rails.logger.info("Tags removed: #{tags.map(&:name)}")

      tags.each(&:really_destroy!)
    end
  end
end
