class Users::RegistrationsController < Devise::RegistrationsController
  layout 'full_page', except: [:edit, :update]

  respond_to :html, :js

  include ActionView::Helpers::TagHelper
  include ApplicationHelper

  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      @location = ''
      if resource.active_for_authentication?
        flash[:success] = t('devise.registrations.signed_up') << ' ' << t('views.user.signup.flash.message') if is_flashing_format? || request.format.js?
        sign_up(resource_name, resource)
        @location = after_sign_up_path_for(resource)

        # Send email with mailboxer to new user
        welcome_message = render_to_string 'users/mailer/welcome', layout: false, locals: {user: resource}
        locatipic_user.send_message(resource, welcome_message, t('email.registration.welcome.subject'))
      else
        set_flash_message :alert, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format? || request.format.js?
        expire_data_after_sign_in!
        @location = after_inactive_sign_up_path_for(resource)
      end

      respond_with resource, location: @location
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
      end
    end
  end

  protected

  def after_sign_up_path_for(_resource)
    after_sign_in_path_for(resource)
    # If user must confirm email use:
    # login_path
  end

  def after_inactive_sign_up_path_for(_resource)
    login_path
  end

  def after_update_path_for(resource)
    user_path(resource)
  end

end
