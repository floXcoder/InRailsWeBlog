feature 'Sign Up', :devise do

  scenario 'visitor can sign up with valid email address and password', basic: true do
    sign_up_with('Test', 'test@example.com', 'please123', 'please123')
    expect(current_path).to eq(login_path)
    expect(page).to have_content t('devise.registrations.signed_up_but_unconfirmed')
  end

  scenario 'visitor is redirected to main page after successful signup', advanced: true do
    sign_up_with('Test', 'test@example.com', 'please123', 'please123')
    expect(current_path).to eq(login_path)
  end

  scenario 'visitor cannot sign up with invalid email address', basic: true do
    sign_up_with('bogus', 'bogus', 'please123', 'please123')
    expect(page).to have_content t('errors.messages.invalid')
  end

  scenario 'visitor cannot sign up without password', basic: true do
    sign_up_with('', 'test@example.com', '', '')
    expect(page).to have_content t('errors.messages.blank')
  end

  scenario 'visitor cannot sign up with a short password', basic: true do
    sign_up_with('Test', 'test@example.com', 'please', 'please')
    expect(page).to have_content t('errors.messages.too_short', count: 8)
  end

  scenario 'visitor cannot sign up without password confirmation', basic: true do
    sign_up_with('Test', 'test@example.com', 'please123', '')
    expect(page).to have_content t('errors.messages.confirmation', attribute: 'Password')
  end

  scenario 'visitor cannot sign up with mismatched password and confirmation', basic: true do
    sign_up_with('Test', 'test@example.com', 'please123', 'mismatch')
    expect(page).to have_content t('errors.messages.confirmation', attribute: 'Password')
  end

  scenario 'visitor cannot sign up with invalid email address', basic: true do
    sign_up_with('bogus', 'bogus', 'please123', 'please123')
    expect(page).to have_content t('errors.messages.invalid')
  end

  scenario 'visitor can see useful links', advanced: true do
    visit new_user_registration_path
    expect(page).to have_link t('devise.shared.links.login'), href: new_user_session_path
    expect(page).to have_link t('devise.shared.links.forgot_password'), href: new_user_password_path
  end

  scenario 'visitor can see the terms of use', advanced: true do
    visit new_user_registration_path
    expect(page).to have_content t('views.user.signup.terms_of_use')
    expect(page).to have_link t('views.user.signup.terms_of_use_name'), href: terms_of_use_path
  end

  scenario 'visitor can see a flash message to confirm his email', advanced: true do
    sign_up_with('Test', 'test@example.com', 'please123', 'please123')
    expect(page).to have_content t('devise.registrations.signed_up_but_unconfirmed')
  end

  scenario 'visitor can see a pop-up to sign up', js: true, basic: true do
    visit root_path

    click_link t('views.header.sign_up')
    expect(page).to have_css '#signup_module.modal'
    expect(page).to have_content /#{t('views.user.signup.title')}/i

    within('#signup_form') do
      fill_in t('user.pseudo'), with: 'Test'
      fill_in t('user.email'), with: 'test@example.com'
      fill_in t('user.password'), with: 'please123'
      fill_in t('views.user.signup.confirm_password'), with: 'please123'
      page.execute_script('$("#terms").click()')
      click_button t('views.user.signup.submit')
    end
    sleep 1
    expect(current_path).to eq(login_path)
  end

end
