# frozen_string_literal: true

class UpdateTrackerWorker
  include Sidekiq::Worker

  sidekiq_options queue: :default

  def perform(*args)
    return if Rails.env.test?

    tracked_class = args.first['tracked_class']

    class_model = tracked_class.classify.constantize

    return unless class_model.respond_to?(:tracker_metrics)

    metrics_used = class_model.tracker_metrics

    class_model.transaction do
      metrics_used.each do |metric|
        $redis.keys("#{tracked_class}:#{metric}:*").map do |tracked_element|
          _element_type, _element_metric, element_id = tracked_element.split(':')
          element_value                              = $redis.get(tracked_element)

          if (element = class_model.find_by(id: element_id))
            return unless element.tracker

            # Warning: Increment do not trigger callbacks
            element.tracker.increment!("#{metric}_count", element_value.to_i)
            element.tracker.update_column(:popularity, element.compute_popularity)
          end

          $redis.del(tracked_element)
        end
      end
    end
  end
end
