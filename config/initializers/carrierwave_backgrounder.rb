CarrierWave::Backgrounder.configure do |c|
  # c.backend :delayed_job, queue: :carrierwave
  c.backend :sidekiq, queue: :_InRailsWeBlog_carrierwave
end
