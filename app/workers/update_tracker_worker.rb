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
          _element_type, _element_metric, element_id, user_id, parent_id = tracked_element.split(':')
          element_value                                                  = $redis.get(tracked_element)

          # Save only if element has à tracker, doesn't belong to current user and if not private
          if (element = class_model.find_by(id: element_id))
            next unless element.tracker
            next if user_id && element.try(:user_id) == user_id
            next if element.try(:only_me?)

            if metric == :visits
              element.tracker.update_column(:visits_count, count_visits(tracked_class, element_value))
            else
              # Warning: Increment do not trigger model callbacks
              element.tracker.increment!("#{metric}_count", element_value.to_i)
            end

            element.tracker.update_column(:popularity, element.compute_popularity)

            # Call callbacks if any
            try_callback(metric.to_sym, element, user_id, parent_id)
          end

          $redis.del(tracked_element)
        end
      end
    end
  end

  private

  def count_visits(tracked_class, element_value)
    Ahoy::Event.where(name: 'page_visit').where("properties->>'#{tracked_class.downcase}_id' = ?", element_value.to_s).joins(:visit).merge(Ahoy::Visit.where(validated: true)).distinct.count(:visit_id)
  end

  def try_callback(action, record, user_id = nil, parent_id = nil)
    return unless record.tracker_callbacks && record.tracker_callbacks[action] && record.respond_to?(record.tracker_callbacks[action], true)

    record.send(record.tracker_callbacks[action], user_id, parent_id)
  end

end
