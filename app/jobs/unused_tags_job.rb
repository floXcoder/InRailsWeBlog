# frozen_string_literal: true

class UnusedTagsJob < ApplicationJob
  queue_as :default

  def perform
    Tag.unused.find_in_batches(batch_size: 200) do |tags|
      Rails.logger.info("Tags removed: #{tags.map(&:name)}")

      tags.each(&:really_destroy!)
    end
  end
end
