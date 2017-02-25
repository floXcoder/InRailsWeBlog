class TagsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default

  def perform
    Tag
      .unused
      .find_in_batches(batch_size: 200) do |tags|
      tags.each do |tag|
        tag.really_destroy!
      end
    end
  end
end
