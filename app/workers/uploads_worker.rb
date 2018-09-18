# frozen_string_literal: true

class UploadsWorker
  include Sidekiq::Worker
  include Sidekiq::Status::Worker

  sidekiq_options queue: :default

  # Clean uploads without imageable_id and older than 1 day
  def perform
    Picture.transaction do
      Picture
        .where('updated_at < :day', day: 1.day.ago)
        .where(imageable_id: nil)
        .find_in_batches(batch_size: 200) do |pictures|
        pictures.each(&:really_destroy!)
      end
    end
  end
end
