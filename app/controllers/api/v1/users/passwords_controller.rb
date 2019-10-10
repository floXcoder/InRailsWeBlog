# frozen_string_literal: true

module Api::V1
  class Users::PasswordsController < Devise::PasswordsController

    def create
      self.resource = resource_class.send_reset_password_instructions(resource_params)
      yield resource if block_given?

      if successfully_sent?(resource)
        respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
      else
        respond_with(resource)
      end
    end

    def update
      self.resource = resource_class.reset_password_by_token(resource_params)
      yield resource if block_given?

      if resource.errors.empty?
        resource.unlock_access! if unlockable?(resource)
        if Devise.sign_in_after_reset_password
          flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
          set_flash_message!(:notice, flash_message)
          resource.after_database_authentication
          sign_in(resource_name, resource)
        else
          set_flash_message!(:notice, :updated_not_active)
        end
        respond_with resource, location: after_resetting_password_path_for(resource)
      else
        set_minimum_password_length
        flash[:error] = resource.errors.full_messages.join(', ')
        @location = edit_password_path(reset_password_token: resource_params[:reset_password_token])
        respond_to do |format|
          format.html { redirect_to(@location) }
        end
      end
    end

    private

    def after_sending_reset_password_instructions_path_for(_resource_name)
      root_path if is_navigational_format?
    end

    def after_resetting_password_path_for(_resource_name)
      root_path if is_navigational_format?
    end

  end
end
