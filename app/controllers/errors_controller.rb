class ErrorsController < ApplicationController
  before_action :authenticate_user!, except: [:create]
  after_action :verify_authorized, except: [:create]

  skip_before_action :set_locale, only: [:create]

  respond_to :json

  def index
    authorize current_user, :admin?

    errors = ErrorMessage.all.order('id DESC')

    respond_to do |format|
      format.json { render json: errors }
    end
  end

  def create
    error            = ErrorMessage.new(error_params)
    error.user_agent = request.user_agent
    error.ip         = request.remote_ip
    error.user_info  = current_user.pseudo if current_user

    error.save

    # respond_to do |format|
    #   if error.save
    #     format.json { render json: error, status: :created }
    #   else
    #     format.json { render json: error.errors, status: :unprocessable_entity }
    #   end
    # end
    render nothing: true
  end

  private

  def error_params
    params.require(:error).permit(:message,
                                  :class_name,
                                  :line_number,
                                  :column_number,
                                  :trace,
                                  :target_url,
                                  :origin)
  end


end
