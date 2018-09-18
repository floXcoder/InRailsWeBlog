# frozen_string_literal: true

module Features
  module SessionHelpers

    def sign_up_with(pseudo, email, password, confirmation)
      visit signup_path
      fill_in t('user.model.pseudo'), with: pseudo
      fill_in t('user.model.email'), with: email
      fill_in t('user.model.password'), with: password
      fill_in t('views.user.signup.confirm_password'), with: confirmation
      check('user_terms')
      click_button t('views.user.signup.submit')
    end

    def login_with(login, password)
      visit login_path
      fill_in t('user.model.login'), with: login
      fill_in t('user.model.password'), with: password
      click_button t('views.user.login.submit')
    end

    def log_out
      visit root_path
      click_link t('js.views.header.user.log_out')
    end

  end
end
