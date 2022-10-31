# frozen_string_literal: true

# ActAsTrackedConcern

# Popularity is automatically calculated
# To sort elements, use rank
# Rank can be included into popularity using the custom_popularity method

# Include this method in the model:
# acts_as_tracked :queries, :searches, :comments, :bookmarks, :clicks, :views, :visits
module ActAsTrackedConcern
  extend ActiveSupport::Concern

  included do
    # Add relationship with tracker model to store all events
    has_one :tracker,
            class_name: 'Tracker',
            as:         :tracked,
            autosave:   true,
            dependent:  :destroy
    accepts_nested_attributes_for :tracker,
                                  allow_destroy: true

    # Add the tracker to the new object
    after_create :add_tracker

    # Class methods required for tracker: project name tracked and actions to track
    class_attribute :tracked_name, :tracker_metrics, :tracker_callbacks

    # Helpers scope to get useful information
    scope :most_visited, -> { joins(:tracker).order('trackers.visits_count DESC NULLS LAST') }
    scope :most_viewed, -> { joins(:tracker).order('trackers.views_count DESC NULLS LAST') }
    scope :most_clicked, -> { joins(:tracker).order('trackers.clicks_count DESC NULLS LAST') }
    scope :recently_tracked, -> { joins(:tracker).where(trackers: { updated_at: 15.days.ago..Time.zone.now }) }
    scope :home, -> (limit = 10) { joins(:tracker).where(trackers: { home_page: true }).limit(limit) }

    # Popularity
    before_update :update_popularity
    scope :populars, -> (limit = 10) { left_outer_joins(:tracker).order('trackers.popularity DESC NULLS LAST').limit(limit) }
  end

  # Popularity
  def update_popularity
    return if self.destroyed? || (self.has_attribute?(:deleted_at) && self.deleted_at) || !self.tracker || self.tracker.popularity_changed?

    self.tracker.popularity = compute_popularity
  end

  def compute_popularity
    popularity    = 0
    tracker_count = 0

    if self.tracker_metrics.include? :visits
      popularity    += self.tracker.visits_count * 10
      tracker_count += 1
    end
    if self.tracker_metrics.include? :clicks
      popularity    += self.tracker.clicks_count * 5
      tracker_count += 1
    end
    if self.tracker_metrics.include? :views
      popularity    += self.tracker.views_count
      tracker_count += 1
    end
    if self.tracker_metrics.include? :queries
      popularity    += self.tracker.queries_count
      tracker_count += 1
    end
    if self.tracker_metrics.include? :searches
      popularity    += self.tracker.searches_count * 2
      tracker_count += 1
    end

    if defined?(custom_popularity)
      popularity, tracker_count = custom_popularity(popularity, tracker_count)
    end

    return popularity / tracker_count
  end

  # Method called after object creation
  def add_tracker
    self.create_tracker(tracked: self)
  end

  # Class methods
  class_methods do
    # Base method to include in model:
    # acts_as_tracked '<PROJECT NAME>', :queries, :searches, :bookmarks, :clicks, :views, :visits
    def acts_as_tracked(tracked_name, *trackers)
      options                = trackers.extract_options!
      self.tracked_name      = tracked_name
      self.tracker_metrics   = trackers
      self.tracker_callbacks = options[:callbacks]

      track_queries
    end

    # Tracker model method to increment visit count (Visits are counted with Ahoy)
    def track_visits(record_id, user_id = nil, parent_id = nil)
      return unless self.tracker_metrics.include?(:visits)

      if record_id.is_a? Array
        record_id.each do |id|
          $redis.incr(redis_key(id, 'visits', user_id, parent_id))
        end
      else
        $redis.incr(redis_key(record_id, 'visits', user_id, parent_id))
      end
    end

    # Tracker model method to increment view count
    def track_views(record_id, user_id = nil, parent_id = nil)
      return unless self.tracker_metrics.include?(:views)

      if record_id.is_a? Array
        record_id.each do |id|
          $redis.incr(redis_key(id, 'views', user_id, parent_id))
        end
      else
        $redis.incr(redis_key(record_id, 'views', user_id, parent_id))
      end
    end

    # Tracker model method to increment click count
    def track_clicks(record_id, user_id = nil, parent_id = nil)
      return unless self.tracker_metrics.include?(:clicks)

      if record_id.is_a? Array
        record_id.each do |id|
          $redis.incr(redis_key(id, 'clicks', user_id, parent_id))
        end
      else
        $redis.incr(redis_key(record_id, 'clicks', user_id, parent_id))
      end
    end

    # Tracker model method to increment search count
    def track_searches(record_ids)
      return unless self.tracker_metrics.include?(:searches)

      record_ids.each do |record_id|
        $redis.incr(redis_key(record_id, 'searches'))
      end
    end

    private

    # Private model method to increment find count
    def track_queries
      return unless self.tracker_metrics.include?(:queries)

      after_find do |record|
        $redis.incr(redis_key(record, 'queries'))
      end
    end

    # Private method to get formatted redis key (for object model)
    def redis_key(record_id, metric, user_id = nil, parent_id = nil)
      [self.name.downcase, metric, record_id, user_id, parent_id].compact.join(':')
    end
  end

  # Private method to get formatted redis key (for class model)
  def redis_key(record, metric, user_id = nil, parent_id = nil)
    [self.class.name.downcase, metric, record.id, user_id, parent_id].compact.join(':')
  end
end
