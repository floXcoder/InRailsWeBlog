# frozen_string_literal: true

class Admins::SessionsController < Devise::SessionsController
  layout 'admin'

  respond_to :html

  def new
    self.resource = resource_class.new(sign_in_params)
    clean_up_passwords(resource)
    yield resource if block_given?

    respond_to do |format|
      format.html { render 'admins/login' }
    end
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    flash_message(resource) if is_flashing_format? || request.format.js?
    sign_in(resource_name, resource)
    yield resource if block_given?

    @location = after_sign_in_path_for(resource)
    respond_to do |format|
      format.html { redirect_to(@location) }
    end
  end

  def failure
    error_msg = I18n.t('devise.failure.invalid', authentication_keys: params[resource_name] ? params[resource_name][:login] : params[:login])
    redirect_after_failure(error_msg)
  end

  protected

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#failure" }
  end

  def redirect_after_failure(_error_msg)
    respond_to do |format|
      format.html do
        redirect_to send("home_#{I18n.locale}_path")
      end
    end
  end

  def flash_message(_admin)
    flash[:success] = t('devise.sessions.signed_in')
  end
end
