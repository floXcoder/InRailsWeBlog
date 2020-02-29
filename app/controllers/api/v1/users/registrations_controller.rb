# frozen_string_literal: true

module Api::V1
  class Users::RegistrationsController < Devise::RegistrationsController
    include ActionView::Helpers::TagHelper
    include ApplicationHelper

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
          @location = after_sign_up_path_for(resource)
        else
          set_flash_message :alert, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format? || request.format.js?
          expire_data_after_sign_in!
          @location = after_inactive_sign_up_path_for(resource)
        end

        respond_with UserProfileSerializer.new(resource,
                                               include: [:current_topic, :topics, :contributed_topics]),
                     location: @location
      else
        respond_to do |format|
          format.html do
            clean_up_passwords resource
            respond_with resource
          end

          format.js do
            clean_up_passwords resource
            flash.now[:alert] = resource.errors.full_messages.to_sentence
            render template: 'devise/registrations/failure'
          end

          format.json do
            clean_up_passwords resource
            flash.now[:alert] = resource.errors.full_messages.to_sentence
            respond_with resource
          end
        end
      end
    end

    protected

    def after_sign_up_path_for(_resource)
      after_sign_in_path_for(resource)
      # If user must confirm email use:
      # login_path
    end

  end
end
