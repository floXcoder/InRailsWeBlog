if (RailsExceptionHandler.configuration.activate?)
  class ErrorResponseController < ApplicationController
    layout 'full_page'

    def index
      status = @_env['exception_handler.response']
      render :index, locals: { status: status }, status: status
    end

    def dummy_action
      render nothing: true
    end
  end
end
