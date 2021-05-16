# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  # http://localhost:3000/rails/mailers/user_mailer/welcome_email
  def welcome_email
    @user = User.last

    UserMailer.welcome_email(@user)
  end
end
