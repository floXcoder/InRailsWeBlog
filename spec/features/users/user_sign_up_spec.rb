feature 'Sign Up', advanced: true, js: true do

  # Checkbox for accept terms not found !
  # scenario 'visitor can sign up with valid email address and password' do
  #   sign_up_with('Test', 'test@example.com', 'please123', 'please123')
  #   expect(current_path).to eq(login_path)
  #   expect(page).to have_content t('devise.registrations.signed_up_but_unconfirmed')
  # end
  #
  # scenario 'visitor is redirected to main page after successful signup' do
  #   sign_up_with('Test', 'test@example.com', 'please123', 'please123')
  #   expect(current_path).to eq(login_path)
  # end
  #
  # scenario 'visitor cannot sign up with invalid email address' do
  #   sign_up_with('bogus', 'bogus', 'please123', 'please123')
  #   expect(page).to have_content t('errors.messages.invalid')
  # end
  #
  # scenario 'visitor cannot sign up without password' do
  #   sign_up_with('', 'test@example.com', '', '')
  #   expect(page).to have_content t('errors.messages.blank')
  # end
  #
  # scenario 'visitor cannot sign up with a short password' do
  #   sign_up_with('Test', 'test@example.com', 'please', 'please')
  #   expect(page).to have_content t('errors.messages.too_short', count: 8)
  # end
  #
  # scenario 'visitor cannot sign up without password confirmation' do
  #   sign_up_with('Test', 'test@example.com', 'please123', '')
  #   expect(page).to have_content t('errors.messages.confirmation', attribute: 'Password')
  # end
  #
  # scenario 'visitor cannot sign up with mismatched password and confirmation' do
  #   sign_up_with('Test', 'test@example.com', 'please123', 'mismatch')
  #   expect(page).to have_content t('errors.messages.confirmation', attribute: 'Password')
  # end
  #
  # scenario 'visitor cannot sign up with invalid email address' do
  #   sign_up_with('bogus', 'bogus', 'please123', 'please123')
  #   expect(page).to have_content t('errors.messages.invalid')
  # end
  #
  # scenario 'visitor can see useful links' do
  #   visit new_user_registration_path
  #   expect(page).to have_link t('devise.shared.links.login'), href: new_user_session_path
  #   expect(page).to have_link t('devise.shared.links.forgot_password'), href: new_user_password_path
  # end
  #
  # scenario 'visitor can see the terms of use' do
  #   visit new_user_registration_path
  #   expect(page).to have_content t('views.user.signup.terms_of_use', website: ENV['WEBSITE_NAME'])
  #   # expect(page).to have_link t('views.user.signup.terms_of_use', website: ENV['WEBSITE_NAME']), href: terms_of_use_path
  # end
  #
  # scenario 'visitor can see a flash message to confirm his email' do
  #   sign_up_with('Test', 'test@example.com', 'please123', 'please123')
  #   expect(page).to have_content t('devise.registrations.signed_up_but_unconfirmed')
  # end

  # scenario 'visitor can see a pop-up to sign up' do
  #   visit root_path
  #
  #   click_link t('views.header.profile.not_connected')
  #   click_link t('views.header.sign_up')
  #   expect(page).to have_css '#signup_module.modal'
  #   expect(page).to have_content /#{t('views.user.signup.title')}/i
  #
  #   within('#signup_form') do
  #     fill_in t('user.model.pseudo'), with: 'Test'
  #     fill_in t('user.model.email'), with: 'test@example.com'
  #     fill_in t('user.model.password'), with: 'please123'
  #     fill_in t('views.user.signup.confirm_password'), with: 'please123'
  #     page.execute_script('$("#terms").click()')
  #     click_button t('views.user.signup.submit')
  #   end
  #   sleep 1
  #   expect(current_path).to eq(login_path)
  # end

end
