feature 'User Confirmation', advanced: true do

  background(:all) do
    @user = create(:user, :confirmed, email: user_info[:email])
  end

  given(:user_info) { {pseudo: 'Pseudo',
                       email: 'test@locatipic.fr',
                       password: 'new_password'}
  }

  given(:new_confirmation_page) { UserPage.new(new_user_confirmation_path) }

  background do
    new_confirmation_page.visit
  end

  subject { new_confirmation_page }

  feature 'New Unlock page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: new_confirmation_page,
            title: t('devise.resend.title'),
            stylesheet_name: 'users/new',
            javascript_name: 'users/signup',
            common_js: ['commons-full-page'],
            full_page: true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
