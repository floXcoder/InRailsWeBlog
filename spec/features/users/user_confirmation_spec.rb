feature 'User Confirmation' do

  given(:user_info) { {pseudo: 'Pseudo',
                       email: 'test@l-x.fr',
                       password: 'new_password'}
  }
  given(:user) { FactoryGirl.create(:user, :confirmed, email: user_info[:email]) }

  given(:new_confirmation_page) { UserPage.new(new_user_confirmation_path) }

  background do
    new_confirmation_page.visit
  end

  subject { new_confirmation_page }

  feature 'New Unlock page', js: true, basic: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: new_confirmation_page,
            title: t('devise.resend.page_title'),
            stylesheet_name: 'users/new',
            javascript_name: 'users/signup',
            common_js: %w(commons common-user)
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
