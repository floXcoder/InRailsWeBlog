# frozen_string_literal: true

class UpdateTrackerWorker
  include Sidekiq::Job

  sidekiq_options queue: :default

  def perform(*args)
    return if Rails.env.test?

    tracked_class = args.first&.with_indifferent_access&.dig('tracked_class')
    return unless tracked_class

    class_model = tracked_class.classify.constantize
    return unless class_model.respond_to?(:tracker_metrics)

    metrics_used = class_model.tracker_metrics

    class_model.transaction do
      metrics_used.each do |metric|
        $redis.keys("#{tracked_class}:#{metric}:*").map do |tracked_element|
          _element_type, _element_metric, element_id, user_id, parent_id = tracked_element.split(':')
          element_count                                                  = $redis.get(tracked_element)

          $redis.del(tracked_element)

          # Save only if:
          element = class_model.find_by(id: element_id)
          #  - element has a tracker
          next unless element&.tracker
          #  - doesn't belong to current user
          next if user_id && element.try(:user_id) == user_id
          #  - not private
          next if element.try(:only_me?)

          if metric.to_sym == :visits
            element.tracker.update_column(:visits_count, count_visits(tracked_class, element_id))
          else
            # Warning: Increment do not trigger model callbacks
            element.tracker.increment!("#{metric}_count", element_count.to_i)
          end

          element.tracker.update_column(:popularity, element.compute_popularity)

          # Call callbacks if any
          try_callback(metric.to_sym, element, user_id, parent_id)
        end
      end
    end

    return nil
  end

  private

  def count_visits(tracked_class, element_id)
    Ahoy::Event.where(name: 'page_visit').where("properties->>'#{tracked_class.downcase}_id' = ?", element_id.to_s).joins(:visit).merge(Ahoy::Visit.validated.external).distinct.count(:visit_id)
  end

  def try_callback(action, record, user_id = nil, parent_id = nil)
    return unless record.tracker_callbacks && record.tracker_callbacks[action] && record.respond_to?(record.tracker_callbacks[action], true)

    record.send(record.tracker_callbacks[action], user_id, parent_id)
  end

end
