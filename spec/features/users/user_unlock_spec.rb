feature 'User Unlock' do

  given(:user_info) { {pseudo: 'Pseudo',
                       email: 'test@example.com',
                       password: 'new_password'}
  }
  given(:user) { FactoryGirl.create(:user, :confirmed, email: user_info[:email]) }

  given(:new_unlock_page) { UserPage.new(new_user_unlock_path) }

  background do
    new_unlock_page.visit
  end

  subject { new_unlock_page }

  feature 'New Unlock page', js: true, basic: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: new_unlock_page,
            title: t('devise.unlocks.page_title'),
            stylesheet_name: 'users/new',
            javascript_name: 'users/password',
            common_js: %w(commons common-user)
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
