if Rails.env.benchmark?
  Rack::MiniProfiler.config.auto_inject = true
  Rack::MiniProfiler.config.use_existing_jquery = true
  Rack::MiniProfiler.config.position = 'left'

  Rack::MiniProfiler.config.storage = Rack::MiniProfiler::MemoryStore # ou FileStore
end
