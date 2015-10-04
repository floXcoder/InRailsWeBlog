feature 'Log out', :devise do

  scenario 'user logs out successfully', basic: true do
    user = FactoryGirl.create(:user, :confirmed)
    login_with(user.email, user.password)
    expect(page).to have_content t('devise.sessions.signed_in')
    click_link t('views.header.log_out')
    expect(page).to have_content t('devise.sessions.signed_out')
  end

end


