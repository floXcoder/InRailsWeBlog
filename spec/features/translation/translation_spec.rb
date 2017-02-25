feature 'Translation', advanced: true do

  scenario 'user see the page in french by default' do
    visit root_path
    expect(page).to have_content 'S\'inscrire'
    expect(page).to have_content 'Se connecter'
  end

  scenario 'user can change the language of the current page to english' do
    visit root_path
    within('ul#language-dropdown') do
      click_link 'Anglais'
    end
    expect(page).to have_content 'Sign Up'
    expect(page).to have_content 'Log In'
  end

  # Capybara reset the session
  # scenario 'the language stays the same for other pages' do
  #   visit root_path
  #   within('ul#user-dropdown') do
  #     click_link 'Log In'
  #   end
  #   expect(page).to have_content 'Log In'
  # end

  # scenario 'user can change the language of the current page to chinese' do
  #   visit root_path
  #   click_link 'Chinois'
  #   expect(page).to have_content 'S\'inscrire'
  #   expect(page).to have_content 'Se connecter'
  # end

  # scenario 'The browser language is used by default', js: true do
  #   visit root_path
  #   expect(page).to have_content 'SE CONNECTER'
  # end

end
