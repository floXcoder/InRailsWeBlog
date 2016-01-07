# ActAsTrackedConcern
# Include this method in the model:
# acts_as_tracked '<PROJECT NAME>', :queries, :searches, :comments, :bookmarks, :clicks, :views
module ActAsTrackedConcern
  extend ActiveSupport::Concern

  included do
    # Add relationship with tracker model to store all events
    has_one :tracker, class_name: 'Tracker', as: :tracked
    accepts_nested_attributes_for :tracker, allow_destroy: true

    # Add the tracker to the new object
    after_create do |record|
      record.update_attribute(:tracker, Tracker.create(tracked: self))
    end

    # Class methods required for tracker: project name tracked and actions to track
    class_attribute :tracked_name, :tracker_metrics

    # Helpers scope to get useful information
    scope :most_viewed, -> { joins(:tracker).order('trackers.views_count DESC') }
    scope :most_clicked, -> { joins(:tracker).order('trackers.clicks_count DESC') }
    scope :most_commented, -> { joins(:tracker).order('trackers.comments_count DESC') }
    scope :recently_tracked, -> { where(trackers: {updated_at: 15.days.ago..Time.zone.now}) }
  end

  # Tracker model method to increment comment count
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

  # Tracker model method to decrement comment count
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

  # Tracker model method to increment bookmark count
  def track_bookmarks
    if self.tracker_metrics.include? :bookmarks
      self.tracker.increment!('bookmarks_count')
      # $redis.incr(redis_key(self, 'bookmarks'))
    end
  end

  # Tracker model method to decrement bookmark count
  def untrack_bookmarks
    if self.tracker_metrics.include? :bookmarks
      self.tracker.decrement!('bookmarks_count')
      # $redis.decr(redis_key(self, 'bookmarks'))
    end
  end

  # Class methods
  class_methods do
    # Base method to include in model:
    # acts_as_tracked '<PROJECT NAME>', :queries, :searches, :comments, :bookmarks, :clicks, :views
    def acts_as_tracked(tracked_name, *trackers)
      self.tracked_name = tracked_name
      self.tracker_metrics = trackers

      tracker_cron_job

      track_queries
    end

    # Tracker model method to increment search count
    def track_searches(record_ids)
      if self.tracker_metrics.include? :searches
        record_ids.each do |record_id|
          $redis.incr(redis_key(record_id, 'searches'))
        end
      end
    end

    # Tracker model method to increment click count
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

    # Tracker model method to increment view count
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

    # Private model method to increment find count
    def track_queries
      if self.tracker_metrics.include? :queries
        after_find do |record|
          $redis.incr(redis_key(record, 'queries'))
        end
      end
    end

    # Private method to add a cron job to update database each x minutes
    def tracker_cron_job
      cron_job_name = "#{self.tracked_name}job:#{name}_tracker"

      unless Sidekiq::Cron::Job.find(name: cron_job_name)
        Sidekiq::Cron::Job.create(name:  cron_job_name,
                                  cron:  '*/5 * * * *',
                                  class: 'UpdateTrackerWorker',
                                  args:  { tracked_class: name.downcase },
                                  queue: "#{self.tracked_name}default")
      end
    end

    # Private method to get formatted redis key (for object model)
    def redis_key(record_id, metric)
      "#{self.name.downcase}:#{metric}:#{record_id}"
    end
  end

  private

  # Private method to get formatted redis key (for class model)
  def redis_key(record, metric)
    "#{self.class.name.downcase}:#{metric}:#{record.id}"
  end
end
