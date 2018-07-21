class ErrorsController < ApplicationController
  layout 'full_page'

  before_action :authenticate_admin!, except: [:show, :create]

  skip_before_action :verify_authenticity_token, only: [:show, :create]
  skip_before_action :set_locale, only: [:show, :create]

  respond_to :html, :json

  def index
    errors = ErrorMessage.all.order('id DESC')

    respond_to do |format|
      format.json do
        render json: errors,
               root: 'failures'
      end
    end
  end

  def show
    set_meta_tags title:       titleize(I18n.t('views.error.title')),
                  description: I18n.t('views.error.description')

    respond_to do |format|
      format.html { render 'errors/show', locals: { status: status_code }, status: status_code }
      format.json { render json: { error: t('views.error.status.explanation.default'), status: status_code } }
      format.all { render body: nil, status: status_code }
    end
  end

  def create
    if params[:error].present?
      error_parameters = error_params.merge(
        params:      params.to_unsafe_h,
        user_locale: params[:locale] || I18n.locale,
        user_agent:  browser.to_s,
        bot_agent:   browser.bot.name,
        os_agent:    browser.platform.to_s
      )
      error            = ErrorMessage.new_error(error_parameters, request, current_user)
      error.save
    end

    respond_to do |format|
      format.html { head :ok, content_type: 'text/html' }
      format.json { render json: { success: true } }
    end
  end

  def destroy
    error = ErrorMessage.find(params[:id])

    respond_to do |format|
      format.json do
        if error.destroy
          flash.now[:success] = t('views.errors.flash.successful_deletion')
          head :no_content, content_type: 'application/json'
        else
          flash.now[:error] = I18n.t('views.errors.flash.error_deletion')
          render json: { errors: error.errors }, status: :unprocessable_entity
        end
      end

    end
  end

  def destroy_all
    destroyed_errors = ErrorMessage.destroy_all

    respond_to do |format|
      format.json do
        if !destroyed_errors.empty?
          flash.now[:success] = t('views.errors.flash.successful_all_deletion')
          render json: { ids: destroyed_errors.map(&:id) }
        else
          flash.now[:error] = t('views.errors.flash.error_all_deletion')
          render json: { deletedErrors: false }
        end
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
