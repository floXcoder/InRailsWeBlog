# frozen_string_literal: true

feature 'Translation', advanced: true, js: true do

  scenario 'user see the page in french by default' do
    logout
    visit root_path
    # expect(page).to have_content('Articles')
    # expect(page).to have_content('Thèmes')
  end

  scenario 'user can change the language of the current page to english' do
    logout
    visit root_path
    # within('.footer-language') do
    #   click_link 'Langue'
    #   click_link 'Anglais'
    # end
    # expect(page).to have_content('Articles')
    # expect(page).to have_content('Topics')
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

end
