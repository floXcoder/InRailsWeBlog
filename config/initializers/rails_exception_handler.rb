RailsExceptionHandler.configure do |config|

  # Defaults to [:production]
  config.environments           = [:production]

  # Layout for error pages
  config.fallback_layout  = 'errors'

  config.responses        = {
    :default     => '500',
    :not_found   => '404',
    :wrong_token => '422',
  }

  config.response_mapping = {
    'ActionController::RoutingError'             => :not_found,
    'ActiveRecord::RecordNotFound'               => :not_found,
    'AbstractController::ActionNotFound'         => :not_found,
    'ActionController::InvalidAuthenticityToken' => :wrong_token
  }

  # Available options: [:active_record, :rails_log, :remote_url => {:target => 'http://example.com'}]
  config.storage_strategies     = [:active_record, :rails_log]

  # Change database/table for the active_record storage strategy
  config.active_record_store_in = {
    database:     Rails.env.to_sym,
    record_table: 'error_messages'
  }

  config.store_request_info do |storage, request|
    storage[:target_url]  = request.url
    storage[:referer_url] = request.referer
    storage[:params]      = request.params.inspect
    storage[:user_agent]  = request.user_agent
  end

  config.store_exception_info do |storage, exception|
    storage[:class_name] = exception.class.to_s
    storage[:message]    = exception.to_s
    storage[:trace]      = exception.backtrace.join("\n")
  end

  config.store_environment_info do |storage, env|
    storage[:doc_root] = env['DOCUMENT_ROOT']
  end

  config.store_global_info do |storage|
    storage[:app_name]   = Rails.application.class.parent_name
    storage[:created_at] = Time.zone.now
  end

  # Helper method for easier access to current_user
  config.store_user_info = {
    method: :current_user,
    field:  :pseudo
  }
end
