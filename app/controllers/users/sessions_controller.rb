class Users::SessionsController < Devise::SessionsController
  prepend_before_action :check_unconfirmed_user, if: -> { request.xhr? }

  respond_to :html, :js

  # include ActionView::Helpers::DateHelper
  include ActionView::Helpers::TagHelper
  include ApplicationHelper

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message(:notice, :signed_in) if is_flashing_format? || request.format.js?
    sign_in(resource_name, resource)
    yield resource if block_given?

    @location = after_sign_in_path_for(resource)
    respond_to do |format|
      format.html { redirect_to(@location) }
      format.js
    end
  end

  def failure
    error_msg = I18n.t('devise.failure.invalid', authentication_keys: params[resource_name][:login])
    redirect_after_failure(error_msg)
  end

  protected

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#failure" }
  end

  def redirect_after_failure(error_msg)
    respond_to do |format|
      format.html do
        redirect_to login_path, flash: { error: error_msg }
      end

      format.js do
        js_redirect_to(login_path, :error, error_msg)
      end
    end
  end

  def check_unconfirmed_user
    return if params[:user].blank?

    unless params[:user][:login].blank?
      user = User.where('email = :email OR pseudo = :pseudo', email: params[:user][:login], pseudo: params[:user][:login]).first
      if user && !user.confirmed?
        error_msg = I18n.t('devise.failure.unconfirmed')
        redirect_after_failure(error_msg)
      end
    end
  end
end
