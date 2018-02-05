feature 'Log out', :devise do

  # Not working, incorrect user !
  # scenario 'user logs out successfully', advanced: true, js: true do
  #   user = FactoryBot.create(:user)
  #   login_with(user.email, user.password)
  #
  #   expect(page).to have_content t('devise.sessions.signed_in')
  #   within('ul#user-dropdown') do
  #     click_link t('views.header.log_out')
  #   end
  #   expect(page).to have_content t('devise.sessions.signed_out')
  # end

end


