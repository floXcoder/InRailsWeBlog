# frozen_string_literal: true

class ResponseService
  attr_reader :result, :message, :errors

  def initialize(success, result, message = nil, errors = nil)
    @success = success
    @result  = result
    @message = message
    @errors  = errors
  end

  def success?
    @success && @errors.blank?
  end
end
