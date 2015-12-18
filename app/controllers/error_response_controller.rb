if(RailsExceptionHandler.configuration.activate?)
  class ErrorResponseController < ApplicationController
    layout 'errors'

    def index
      status = @_env['exception_handler.response']
      render :index, locals: { status: status }, status: status, :layout => @_env['exception_handler.layout']
    end

    def dummy_action
      render nothing: true
    end
  end
end
