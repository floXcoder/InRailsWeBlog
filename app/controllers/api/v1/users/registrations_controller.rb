# frozen_string_literal: true

module Api::V1
  class Users::RegistrationsController < Devise::RegistrationsController
    include ActionView::Helpers::TagHelper
    include ApplicationHelper

    before_action :set_env
    before_action :honeypot_protection, only: [:create]

    respond_to :html, :js, :json

    def create
      build_resource(sign_up_params)

      resource.save
      yield resource if block_given?
      if resource.persisted?
        @location = ''
        if resource.active_for_authentication?
          flash[:success] = t('devise.registrations.signed_up') if is_flashing_format? || request.format.js?
          sign_up(resource_name, resource)
          after_sign_up(resource)
          @location = after_sign_up_path_for(resource)
        else
          set_flash_message :alert, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format? || request.format.js?
          expire_data_after_sign_in!
          @location = after_inactive_sign_up_path_for(resource)
        end

        track_successful_registration

        respond_with resource.serialized_json('profile', meta: { location: @location }),
                     location: @location
      else
        respond_to do |format|
          # Ensure to use the first format if format is */*
          format.json do
            clean_up_passwords resource
            flash.now[:alert] = resource.errors.full_messages.to_sentence
            respond_with resource
          end

          format.html do
            clean_up_passwords resource
            respond_with resource
          end

          format.js do
            clean_up_passwords resource
            flash.now[:alert] = resource.errors.full_messages.to_sentence
            render template: 'devise/registrations/failure'
          end
        end
      end
    end

    protected

    def set_env
      user_env = ::Users::EnvironmentService.new(session,
                                                 cookies,
                                                 http_accept_language,
                                                 locale:         ensure_locale_params(params[:locale]),
                                                 force_locale:   ensure_locale_params(params[:force_locale]),
                                                 default_locale: request.path == '/' ? 'en' : nil).perform

      I18n.locale = user_env.result[:locale]
    end

    def require_no_authentication
      assert_is_devise_resource!
      return unless is_navigational_format?

      no_input = devise_mapping.no_input_strategies

      authenticated = if no_input.present?
                        args = no_input.dup.push scope: resource_name
                        warden.authenticate?(*args)
                      else
                        warden.authenticated?(resource_name)
                      end

      if authenticated && (resource = warden.user(resource_name))
        set_flash_message(:alert, 'already_authenticated', scope: 'devise.failure')

        respond_with resource.serialized_json('complete', meta: { token: form_authenticity_token }),
                     location: @location
      end
    end

    def after_sign_up(resource)
      UserMailer.welcome_email(resource).deliver_now
    end

    def after_sign_up_path_for(resource)
      after_sign_in_path_for(resource)
      # If user must confirm email use:
      # login_path
    end

    def track_successful_registration
      track_action(action: 'user_registration_success', email: params.dig(:user, :email))
    end

  end
end
