class UpdateTrackerWorker
  include Sidekiq::Worker
  sidekiq_options queue: :_InRailsWeBlog_default

  def perform(*args)
    tracked_class = args.first['tracked_class']

    class_model = tracked_class.classify.constantize
    metrics_used = class_model.tracker_metrics

    class_model.transaction do
      metrics_used.each do |metric|
        $redis.keys("#{tracked_class}:#{metric.to_s}:*").each do |tracked_element|
          _element_type, _element_metric, element_id = tracked_element.split(':')
          element_value = $redis.get(tracked_element)

          if (element = class_model.find_by(id: element_id))
            element.tracker.increment!("#{metric}_count", element_value.to_i)
          end

          $redis.del(tracked_element)
        end
      end
    end
  end
end
