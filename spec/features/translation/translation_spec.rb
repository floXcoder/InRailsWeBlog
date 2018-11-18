# frozen_string_literal: true

feature 'Translation', advanced: true, js: true do
  scenario 'user see the page in french' do
    logout(:user)
    visit root_path

    expect(page).to have_content('SE CONNECTER')
    expect(page).to have_content('Explorez les articles populaires')
  end

  scenario 'user can change in english' do
    I18n.with_locale(:en) do
      logout(:user)
      visit root_path(locale: 'en')

      expect(page).to have_content('LOG IN')
      expect(page).to have_content('Explore popular articles')
    end
  end

end
