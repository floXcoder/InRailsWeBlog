# frozen_string_literal: true

module Api::V1
  class Users::SessionsController < Devise::SessionsController
    include ActionView::Helpers::TagHelper
    include ApplicationHelper

    prepend_before_action :check_unconfirmed_user, if: -> { request.xhr? }

    # Manage JSON response
    skip_before_action :require_no_authentication, only: [:create]

    before_action :honeypot_protection, only: [:create]

    respond_to :html, :js, :json

    def create
      self.resource = warden.authenticate!(auth_options)
      flash_message(resource) if is_flashing_format? || request.format.js?
      sign_in(resource_name, resource)
      yield resource if block_given?

      track_successful_connection

      @location = after_sign_in_path_for(resource)
      respond_to do |format|
        format.html { redirect_to(@location) }
        format.js
        format.json { render json: resource.serialized_json('profile', meta: { location: @location }) }
      end
    end

    def failure
      # Called by recall below
      error_msg = I18n.t('devise.failure.invalid', authentication_keys: params[resource_name] ? params[resource_name][:login] : params[:login])
      redirect_after_failure(error_msg)
    end

    def destroy
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      set_flash_message! :notice, :signed_out if signed_out
      yield if block_given?

      @location = after_sign_out_path_for(resource)
      respond_to do |format|
        # Ensure to use the first format if format is */*
        format.json { render json: { location: @location } }
        format.js
        format.html { redirect_to(@location) }
      end
    end

    protected

    def auth_options
      { scope: resource_name, recall: "#{controller_path}#failure" }
    end

    def redirect_after_failure(error_msg)
      respond_to do |format|
        format.html do
          redirect_to after_failure_path, flash: { error: error_msg }
        end

        format.js do
          js_redirect_to(after_failure_path, :error, error_msg)
        end

        format.json do
          flash.now[:error] = error_msg
          render json: { error: error_msg }, status: :unauthorized
        end
      end
    end

    def flash_message(_user)
      flash[:success] = t('devise.sessions.signed_in')
    end

    def check_unconfirmed_user
      return if params.dig(:user, :login).blank?

      user = User.find_by_login(params[:user][:login])
      if user && !user.confirmed?
        error_msg = I18n.t('devise.failure.unconfirmed')
        redirect_after_failure(error_msg)
      end
    end

    private

    def track_successful_connection
      track_action(action: 'user_connection_success', email: params.dig(:user, :email))
    end

  end
end
