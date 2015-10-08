feature 'Log in', :devise do

  scenario 'user cannot log in if not registered', advanced: true do
    login_with('test@example.com', 'please123')
    expect(page).to have_content t('devise.failure.not_found_in_database', authentication_keys: 'test@example.com')
  end

  scenario 'user cannot log in with a not validated account even if credentials are valid', advanced: true do
    user = FactoryGirl.create(:user)
    user.update_attributes(confirmation_sent_at: Time.now - 4.days)
    login_with(user.email, user.password)
    expect(page).to have_content t('devise.failure.unconfirmed')
  end

  scenario 'user cannot log in with wrong email', advanced: true do
    user = FactoryGirl.create(:user)
    login_with('invalid@email.com', user.password)
    expect(page).to have_content t('devise.failure.not_found_in_database', authentication_keys: 'invalid@email.com')
  end

  scenario 'user cannot log in with wrong password', advanced: true do
    user = FactoryGirl.create(:user)
    login_with(user.email, 'invalidpass')
    expect(page).to have_content t('devise.failure.invalid', authentication_keys: user.email)
  end

  scenario 'user can log in with his email and a validated account', basic: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.email, user.password)
    expect(page).to have_content t('devise.sessions.signed_in')
  end

  scenario 'user can log in with his pseudo and a validated account', basic: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.pseudo, user.password)
    expect(page).to have_content t('devise.sessions.signed_in')
  end

  scenario 'user is redirected to his profile by default after successful login', advanced: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.email, user.password)
    expect(current_path).to eq(root_user_path(user.slug))
  end

  scenario 'user is redirected to login page if he requests a protected page', advanced: true do
    visit users_path
    expect(current_path).to eq(login_path)
  end

  scenario 'user is redirected to the requested page if exists', advanced: true do
    user = FactoryGirl.create(:user, :confirmed)
    visit edit_user_path(user)
    within('#login_user') do
      fill_in t('user.pseudo'), with: user.email
      fill_in t('user.password'), with: user.password
      click_button t('views.user.login.submit')
    end
    expect(current_path).to eq(edit_user_path(user))
  end

  scenario 'user can access to his account with a nice url format', advanced: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.email, user.password)
    expect(current_path).to match(/\/users\/person\-\d+/)
  end

  scenario 'user can log in with a not validated account but a flash message ask him to confirm his email', advanced: true do
    user = FactoryGirl.create(:user)
    login_with(user.email, user.password)
    expect(page).to have_content t('devise.failure.unconfirmed')
  end

  scenario 'confirmed user can see a flash message confirming his connection', advanced: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.email, user.password)
    expect(page).to have_content t('devise.sessions.signed_in')
  end

  scenario 'visitor can see a pop-up to log in', js: true, basic: true do
    user = FactoryGirl.create(:user, :confirmed)
    I18n.locale = 'fr'

    visit root_path
    click_link t('views.header.profile')
    click_link t('views.header.log_in')
    sleep 1
    expect(page).to have_css '#login_module.modal'
    expect(page).to have_content /#{t('views.user.login.title')}/i

    within('.modal-content') do
      fill_in t('user.id'), with: user.pseudo
      fill_in t('user.password'), with: user.password
      click_button t('views.user.login.submit')
    end

    sleep 1
    expect(current_path).to eq(root_user_path(user.slug))
  end

end
