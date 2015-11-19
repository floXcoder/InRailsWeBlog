if Rails.env.development?
  Rack::MiniProfiler.config.auto_inject = true
  Rack::MiniProfiler.config.use_existing_jquery = true
  Rack::MiniProfiler.config.position = 'right'
  Rack::MiniProfiler.config.start_hidden = true

  Rack::MiniProfiler.config.storage = Rack::MiniProfiler::MemoryStore # ou FileStore
end
