module ActAsTrackedConcern
  extend ActiveSupport::Concern

  included do
    has_one :tracker, class_name: 'Tracker', as: :tracked
    accepts_nested_attributes_for :tracker, allow_destroy: true
    after_create do |record|
      record.update_attribute(:tracker, Tracker.create(tracked: self))
    end
    class_attribute :tracker_metrics

    # Helpers
    scope :most_viewed, -> { joins(:tracker).order('trackers.views_count DESC') }
    scope :most_clicked, -> { joins(:tracker).order('trackers.clicks_count DESC') }
    scope :most_commented, -> { joins(:tracker).order('trackers.comments_count DESC') }
    scope :recently_tracked, -> { where(trackers: {updated_at: 15.days.ago..Time.zone.now}) }
  end

  # Tracking
  def track_comments(comments)
    if self.tracker_metrics.include? :comments
      comments = [comments] unless comments.is_a? Array
      self.transaction do
        comments.each do |_comment|
          self.tracker.increment!('comments_count')
          # $redis.incr(redis_key(self, 'comments'))
        end
      end
    end
  end

  def untrack_comments(comments)
    if self.tracker_metrics.include? :comments
      comments = [comments] unless comments.is_a? Array
      self.transaction do
        comments.each do |_comment|
          self.tracker.decrement!('comments_count')
          # $redis.decr(redis_key(self, 'comments'))
        end
      end
    end
  end

  def track_bookmarks
    if self.tracker_metrics.include? :bookmarks
      self.tracker.increment!('bookmarks_count')
      # $redis.incr(redis_key(self, 'bookmarks'))
    end
  end

  def untrack_bookmarks
    if self.tracker_metrics.include? :bookmarks
      self.tracker.decrement!('bookmarks_count')
      # $redis.decr(redis_key(self, 'bookmarks'))
    end
  end

  # Class methods
  class_methods do
    def acts_as_tracked(*trackers)
      self.tracker_metrics = trackers

      tracker_cron_job

      track_queries
    end

    def track_searches(record_ids)
      if self.tracker_metrics.include? :searches
        record_ids.each do |record_id|
          $redis.incr(redis_key(record_id, 'searches'))
        end
      end
    end

    def track_clicks(record_id)
      if self.tracker_metrics.include? :clicks
        if record_id.is_a? Array
          record_id.each do |id|
            $redis.incr(redis_key(id, 'clicks'))
          end
        else
          $redis.incr(redis_key(record_id, 'clicks'))
        end
      end
    end

    def track_views(record_id)
      if self.tracker_metrics.include? :views
        if record_id.is_a? Array
          record_id.each do |id|
            $redis.incr(redis_key(id, 'views'))
          end
        else
          $redis.incr(redis_key(record_id, 'views'))
        end
      end
    end

    private

    def track_queries
      if self.tracker_metrics.include? :queries
        after_find do |record|
          $redis.incr(redis_key(record, 'queries'))
        end
      end
    end

    def tracker_cron_job
      unless Sidekiq::Cron::Job.find(name: "#{name} tracker")
        Sidekiq::Cron::Job.create(name:  "#{name} tracker",
                                  cron:  '*/5 * * * *',
                                  class: 'UpdateTrackerWorker',
                                  args:  { tracked_class: name.downcase })
      end
    end

    def redis_key(record_id, metric)
      "#{self.name.downcase}:#{metric}:#{record_id}"
    end
  end

  private

  def redis_key(record, metric)
    "#{self.class.name.downcase}:#{metric}:#{record.id}"
  end
end
