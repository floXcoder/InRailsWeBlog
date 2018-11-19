# frozen_string_literal: true

module Api::V1
  class Users::SessionsController < Devise::SessionsController
    include ActionView::Helpers::TagHelper
    include ApplicationHelper

    prepend_before_action :check_unconfirmed_user, if: -> { request.xhr? }

    before_action :honeypot_protection, only: [:create]

    respond_to :html, :js, :json

    def create
      self.resource = warden.authenticate!(auth_options)
      flash_message(resource) if is_flashing_format? || request.format.js?
      sign_in(resource_name, resource)
      yield resource if block_given?

      @location = after_sign_in_path_for(resource)
      respond_to do |format|
        format.html { redirect_to(@location) }
        format.js
        format.json { respond_with resource, serializer: UserProfileSerializer }
      end
    end

    def failure
      error_msg = I18n.t('devise.failure.invalid', authentication_keys: params[resource_name] ? params[resource_name][:login] : '')
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

        format.json do
          flash.now[:error] = error_msg
          render json: { error: error_msg }
        end
      end
    end

    def flash_message(user)
      if user.is_a?(Admin) || user.confirmed?
        flash[:success] = t('devise.sessions.signed_in')
      else
        webmail_name, webmail_address = webmail_from_email(resource.email)
        webmail                       = content_tag(:a, webmail_name, href: webmail_address)

        message = t('devise.sessions.signed_in')
        message << ' ' << t('views.user.login.flash.message')
        message << '<br>' << t('views.user.login.flash.webmail', webmail: webmail) if webmail_name

        flash[:alert] = message
      end
    end

    def check_unconfirmed_user
      return if params[:user].blank?

      if params[:user][:login].present?
        user = User.where('email = :email OR pseudo = :pseudo', email: params[:user][:login], pseudo: params[:user][:login]).first
        if user && !user.confirmed?
          error_msg = I18n.t('devise.failure.unconfirmed')
          redirect_after_failure(error_msg)
        end
      end
    end
  end
end
