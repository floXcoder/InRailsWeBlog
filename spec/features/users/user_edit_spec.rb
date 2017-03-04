feature 'Edit User', advanced: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_info)        { {pseudo:         'Pseudo',
                             email:           'test@locatipic.fr',
                             password:        'new_password',
                             first_name:      'First name',
                             last_name:       'Last name',
                             addess:          'User address',
                             additional_info: 'My info',
                             country:         'Chine' }
  }
  given(:user_edit_page)   { UserPage.new(edit_user_path(@user)) }
  given(:user_account_edit_page)  { UserPage.new(edit_user_registration_path) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    visit edit_user_path(@user)
  end

  subject { user_edit_page }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_edit_page,
            title: t('views.user.edit.title'),
            asset_name: 'users/edit',
            common_js: ['commons'],
            connected: true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Edit user' do
    scenario 'user can complete his profile' do
      user_edit_page.fill_in_update_profile(user_edit_page.id_for(user, :edit), user_info)
      is_expected.to have_content(t('views.user.flash.successful_edition'))
      expect(current_path).to eq(root_path)
    end

    scenario 'user can see his updated profile' do
      user_edit_page.fill_in_update_profile(user_edit_page.id_for(user, :edit), user_info)
      user_edit_page.visit

      is_expected.to have_field(:user_first_name, with: user_info[:first_name])
      is_expected.to have_field(:user_last_name, with: user_info[:last_name])
      # is_expected.to have_field(:user_city, with: user_info[:address])
      is_expected.to have_select(:user_country, selected: user_info[:country])
      # is_expected.to have_field(:user_additional_info, with: user_info[:additional_info])
    end

    scenario 'user can see a button to edit his account' do
      is_expected.to have_link(t('views.user.edit.connection_parameters'))
    end
  end

  feature 'Edit account' do
    background do
      visit user_account_edit_page.path

      clear_emails
    end

    subject { user_account_edit_page }

    scenario 'user can change his pseudo and email' do
      user_account_edit_page.fill_in_update_account(user_info)

      open_email(user_info[:email])
      expect(current_email).to have_content(t('email.hello'))
      expect(current_email).to have_content(t('email.confirmation.instruction'))
      expect(current_email).to have_link(t('devise.confirmations.link_name'))
      expect(current_email).to have_content(t('email.greeting'))

      current_email.click_link(t('devise.confirmations.link_name'))
      expect(page).to have_content(t('devise.confirmations.confirmed'))

      user_account_edit_page.visit
      is_expected.to have_field(:user_pseudo, with: user_info[:pseudo])
      is_expected.to have_field(:user_email, with: user_info[:email])
    end

    scenario 'user can change his password' do
      user_account_edit_page.fill_in_password_account(user_info)

      expect(page).to have_content(t('devise.registrations.updated'))
    end

    scenario 'user can delete his account' do
      expect {
        click_link t('devise.registrations.cancel.link_name')
      }.to change(User, :count).by(-1)
    end
  end

end
