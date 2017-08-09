feature 'Edit User', advanced: true, js: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_info) { { pseudo:          'Pseudo',
                        email:           'test@locatipic.fr',
                        password:        'new_password',
                        first_name:      'First name',
                        last_name:       'Last name',
                        addess:          'User address',
                        additional_info: 'My info',
                        country:         'Chine' }
  }
  given(:user_edit_page) { UserPage.new(edit_user_path(@user)) }
  given(:user_account_edit_page) { UserPage.new(edit_user_registration_path) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    visit edit_user_path(@user)
  end

  subject { user_edit_page }

  feature 'Page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: user_edit_page,
          title:        t('views.user.edit.title'),
          asset_name:   'users/edit',
          common_js:    ['commons'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Edit user content' do
    scenario 'user can edit his profile' do
      is_expected.to have_content(t('views.user.edit.title'))

      is_expected.to have_field(:user_first_name, with: user_info[:first_name])
      is_expected.to have_field(:user_last_name, with: user_info[:last_name])

      is_expected.to have_link(t('views.user.edit.connection_parameters'))
    end
  end

end
