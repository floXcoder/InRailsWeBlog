# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default template_path: 'pages/mailer'

  def welcome_email(user)
    @user = user

    mail(
      from:    ENV['WEBSITE_EMAIL'],
      to:      user.email,
      subject: t('email.user.welcome.subject', website: ENV['WEBSITE_NAME'])
    )
  end
end
