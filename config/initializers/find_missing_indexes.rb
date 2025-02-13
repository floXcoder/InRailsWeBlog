# frozen_string_literal: true

class NoIndexWarning
  attr_reader :duration, :query, :explain, :name

  def initialize(duration, name, query, explain)
    @duration = duration
    @name     = name
    @query    = query
    @explain  = explain
  end
end

class NoIndexDetector
  MIN_DURATION_WARNING = 20 # Time in ms

  def initialize(warn_once: false, resume: false)
    @warnings       = []
    @no_index_cache = Set.new
    @warn_once      = warn_once
    @resume         = resume
  end

  def resume?
    @resume
  end

  def detect(event)
    payload = event.payload
    query   = payload[:sql]
    return if payload[:name].in? ['SCHEMA', 'ActiveRecord::InternalMetadata Pluck', 'INDEX DETECTOR', 'ActiveRecord::SchemaMigration Pluck']
    return if query.start_with?('BEGIN', 'COMMIT')
    return unless query.start_with?('SELECT', 'UPDATE', 'DELETE')
    return unless query.include?('WHERE') || query.include?('GROUP') || query.include?('ORDER')

    if @warn_once
      return if @no_index_cache.include?(query)

      @no_index_cache << query
    end

    binds = payload[:type_casted_binds]
    binds = binds.call if binds.respond_to?(:call)

    connection = ActiveRecord::Base.connection
    connection.execute('SET enable_seqscan = off') if Rails.env.test?
    result = connection.exec_query(
      "EXPLAIN #{query}",
      'INDEX DETECTOR',
      binds
    ).pluck('QUERY PLAN').join("\n")

    if event.duration > MIN_DURATION_WARNING && result.exclude?('Index')
      warning = NoIndexWarning.new(event.duration, payload[:name], query, result)
      Rails.logger.error ActiveSupport::LogSubscriber.new.send(:color, "SQL request with no index took #{warning.duration.round(1)}ms", :red)
      Rails.logger.info ActiveSupport::LogSubscriber.new.send(:color, "EXPLAIN:\n #{warning.explain}", :yellow)
      Rails.logger.info ActiveSupport::LogSubscriber.new.send(:color, "SQL(#{warning.name}):\n #{query} #{binds.inspect}", :yellow)
      @warnings << warning if resume?
    end
  end

  def resume(event)
    if @warnings.any?
      table = Terminal::Table.new headings: %w[ms name query], rows: @warnings.map { |w| [w.duration.round(1), w.name, w.query.chars.each_slice(80).map(&:join).join("\n")] }
      table.align_column(0, :right)
      table.title = ActiveSupport::LogSubscriber.new.send(:color, "SQL requests without index for #{event.payload[:controller]}##{event.payload[:action]}", :red)
      Rails.logger.error table
      @warnings.clear
    end
    @no_index_cache.clear
  end

  def register
    detector = self

    Rails.application.config.after_initialize do
      ActiveSupport::Notifications.subscribe 'sql.active_record' do |event|
        detector.detect(event)
      end

      ActiveSupport::Notifications.subscribe 'start_processing.action_controller' do |event|
        if event.payload[:params].key?('index_detector')
          Thread.current[:index_detector] = true
        end
      end

      ActiveSupport::Notifications.subscribe 'process_action.action_controller' do |event|
        if Thread.current[:index_detector]
          detector.resume(event) if detector.resume?
          Thread.current[:index_detector] = nil
        end
      end
    end
  end
end

if Rails.env.development?
  require 'terminal-table'

  # create detector after setup
  detector = NoIndexDetector.new(warn_once: true, resume: true)
  detector.register
end
