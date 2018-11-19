# frozen_string_literal: true

feature 'Translation for visitors', advanced: true, js: true do
  scenario 'user see the page in french' do
    logout(:user)
    visit root_path
    page.driver.browser.navigate.refresh

    expect(page).to have_content('SE CONNECTER')
    expect(page).to have_content('Explorez les articles populaires')
  end

  scenario 'user can change in english' do
    I18n.with_locale(:en) do
      logout(:user)
      visit root_path(locale: 'en')
      page.driver.browser.navigate.refresh

      expect(page).to have_content('LOG IN')
      expect(page).to have_content('Explore popular articles')
    end
  end

end
