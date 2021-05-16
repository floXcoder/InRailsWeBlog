# frozen_string_literal: true

class DeviseMailerPreview < ActionMailer::Preview
  # http://localhost:3000/rails/mailers/devise_mailer/confirmation_instructions
  def confirmation_instructions
    @user = User.last

    DeviseMailer.confirmation_instructions(@user, @user.confirmation_token)
  end

  # http://localhost:3000/rails/mailers/devise_mailer/reset_password_instructions
  def reset_password_instructions
    @user = User.last
    @user.send_reset_password_instructions

    DeviseMailer.reset_password_instructions(@user, @user.reset_password_token)
  end

  # http://localhost:3000/rails/mailers/devise_mailer/unlock_token
  def unlock_instructions
    @user = User.last
    @user.send_unlock_instructions

    DeviseMailer.unlock_instructions(@user, @user.unlock_token)
  end
end
