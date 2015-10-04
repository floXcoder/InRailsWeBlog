module Features
  module SessionHelpers

    def sign_up_with(pseudo, email, password, confirmation)
      visit new_user_registration_path
      fill_in t('user.pseudo'), with: pseudo
      fill_in t('user.email'), with: email
      fill_in t('user.password'), with: password
      fill_in t('views.user.signup.confirm_password'), with: confirmation
      check('terms')
      click_button t('views.user.signup.submit')
    end

    def login_with(login, password)
      visit new_user_session_path
      fill_in t('user.id'), with: login
      fill_in t('user.password'), with: password
      click_button t('views.user.login.submit')
    end

    def log_out
      visit root_path
      click_link t('views.header.log_out')
    end

  end

end
