class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def w(msg)
    Rails.logger.ap msg, :warn
    # Rails.logger.ap msg, :warn if Rails.env.development? || Rails.env.test?
  end

end
