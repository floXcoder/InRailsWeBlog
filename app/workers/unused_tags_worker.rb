class UnusedTagsWorker
  include Sidekiq::Worker
  include Sidekiq::Status::Worker
  include Sidekiq::Benchmark::Worker

  sidekiq_options queue: :default

  def perform
    benchmark.unused_tags do
      Tag.unused.find_in_batches(batch_size: 200) do |tags|
        tags.each(&:really_destroy!)
      end
    end

    benchmark.finish
  end
end
