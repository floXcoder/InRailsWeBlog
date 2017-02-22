class ErrorsController < ApplicationController
  before_action :authenticate_user, except: [:create]

  skip_before_action :set_locale, only: [:create]

  respond_to :json

  def index
    errors = ErrorMessage.all.order('id DESC')

    respond_to do |format|
      format.json { render json: errors }
    end
  end

  def create
    error = ErrorMessage.new_error(error_params, request, current_user)
    error.save

    respond_to do |format|
      format.json { render json: { success: true } }
    end
  end

  def destroy
    error = ErrorMessage.find(params[:id])

    respond_to do |format|
      if error.destroy
        flash.now[:success] = t('views.admin.errors.flash.successful_deletion')
        format.json { render json: error.id }
      else
        flash.now[:error] = I18n.t('views.admin.errors.flash.error_deletion')
        format.json { render json: error.errors, status: :forbidden }
      end
    end
  end

  def destroy_all
    destroyed_errors = ErrorMessage.destroy_all

    respond_to do |format|
      if !destroyed_errors.empty?
        flash.now[:success] = t('views.admin.errors.flash.successful_all_deletion')
        format.json { render json: destroyed_errors.map(&:id) }
      else
        flash.now[:error] = t('views.admin.errors.flash.error_all_deletion')
        format.json { render json: { deleted_errors: false } }
      end
    end
  end

  private

  def error_params
    params.require(:error).permit(:message,
                                  :class_name,
                                  :line_number,
                                  :column_number,
                                  :trace,
                                  :params,
                                  :target_url,
                                  :referer_url,
                                  :origin)
  end
end
