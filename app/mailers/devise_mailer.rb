# frozen_string_literal: true

class DeviseMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that you mailer uses the devise views
  default from: ENV['WEBSITE_EMAIL']

  def confirmation_instructions(record, token, opts = {})
    I18n.with_locale(record_locale(record)) do
      super
    end
  end

  def reset_password_instructions(record, token, opts = {})
    I18n.with_locale(record_locale(record)) do
      super
    end
  end

  def unlock_instructions(record, token, opts = {})
    I18n.with_locale(record_locale(record)) do
      super
    end
  end

  private

  def record_locale(record)
    record&.locale || I18n.default_locale
  end
end
