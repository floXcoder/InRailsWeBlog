class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def w(msg)
    Rails.logger.ap msg, :warn
    # Rails.logger.ap msg, :warn if Rails.env.development? || Rails.env.test?
  end

end
