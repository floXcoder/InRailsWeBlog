# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  helper :application # gives access to all helpers defined within `application_helper`.
  helper :mailer

  default from: ENV['WEBSITE_EMAIL']

  layout 'mailer'
end
