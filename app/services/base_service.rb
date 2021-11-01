# frozen_string_literal: true

class BaseService
  attr_accessor :params, :current_user, :current_admin

  def initialize(params = {})
    @current_user  = params.delete(:current_user)
    @current_admin = params.delete(:current_admin)
    @params        = params.dup
  end

  protected

  def success(result, message = nil)
    ResponseService.new(true, result, message)
  end

  def error(message, errors = nil)
    if Rails.env.production?
      Raven.capture_exception(errors || message) if errors.is_a?(Exception) || message.is_a?(Exception)
    elsif errors.is_a?(StandardError)
      Rails.logger.error(errors.to_s)
      errors.backtrace.each do |backtrace|
        Rails.logger.error(backtrace)
      end
    else
      Rails.logger.error(message)
    end

    ResponseService.new(false, nil, message.to_s, errors || message.to_s)
  end

end
