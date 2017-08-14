class ErrorsController < ApplicationController
  layout 'full_page'

  before_action :authenticate_admin!, except: [:show, :create]
  before_action :verify_requested_format!

  skip_before_action :set_locale, only: [:show, :create]

  respond_to :html, :json

  def index
    errors = ErrorMessage.all.order('id DESC')

    respond_to do |format|
      format.json { render json: errors }
    end
  end

  def show
    set_meta_tags title:       titleize(I18n.t('views.error.title')),
                  description: I18n.t('views.error.description')

    respond_to do |format|
      format.html { render 'errors/show', locals: { status: status_code } }
      format.json { render json: { error: t('views.error.status.explanation.default'), status: status_code } }
      format.all { render body: nil, status: status_code }
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
        flash.now[:success] = t('views.errors.flash.successful_deletion')
        format.json { render json: error.id }
      else
        flash.now[:error] = I18n.t('views.errors.flash.error_deletion')
        format.json { render json: error.errors, status: :forbidden }
      end
    end
  end

  def destroy_all
    destroyed_errors = ErrorMessage.destroy_all

    respond_to do |format|
      if !destroyed_errors.empty?
        flash.now[:success] = t('views.errors.flash.successful_all_deletion')
        format.json { render json: destroyed_errors.map(&:id) }
      else
        flash.now[:error] = t('views.errors.flash.error_all_deletion')
        format.json { render json: { deleted_errors: false } }
      end
    end
  end

  private

  def status_code
    params[:code] || 500
  end

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
