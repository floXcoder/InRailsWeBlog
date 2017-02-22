feature 'Edit User' do

  given(:user)             { FactoryGirl.create(:user, :confirmed) }
  given(:user_info)        { {pseudo:        'Pseudo',
                             email:         'test@example.com',
                             password:      'new_password',
                             first_name:    'First name',
                             last_name:     'Last name',
                             age:           '40',
                             addess:        'User address',
                             additional_info: 'My description',
                             country:       'Chine' }
  }
  given(:user_edit_page)   { UserPage.new(edit_user_path(user)) }
  given(:user_account_edit_page)  { UserPage.new(edit_user_registration_path(user)) }

  background do
    login_with(user.email, user.password)
    visit edit_user_path(user)
  end

  subject { user_edit_page }

  feature 'Page', js: true, basic: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_edit_page,
            title: t('views.user.edit.page_title'),
            asset_name: 'users/edit',
            common_js: %w(commons common-user)
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Edit user' do
    scenario 'user can complete his profile', basic: true do
      user_edit_page.fill_in_update_profile(user_edit_page.id_for(user, :edit), user_info)
      is_expected.to have_content(t('views.user.flash.successful_update'))
      expect(current_path).to eq(root_user_path(user))
    end

    scenario 'user can see his updated profile', basic: true do
      user_edit_page.fill_in_update_profile(user_edit_page.id_for(user, :edit), user_info)
      user_edit_page.visit

      is_expected.to have_field(:user_first_name, with: user_info[:first_name])
      is_expected.to have_field(:user_last_name, with: user_info[:last_name])
      is_expected.to have_select(:user_age, selected: user_info[:age])
      is_expected.to have_field(:user_city, with: user_info[:address])
      is_expected.to have_select(:user_country, selected: user_info[:country])
      is_expected.to have_field(:user_additional_info, with: user_info[:additional_info])
    end

    scenario 'user can see a button to edit his account', basic: true do
      is_expected.to have_link(t('views.user.edit.connection_parameters'), href: edit_user_registration_path(user))
    end
  end

  feature 'Edit account' do
    background do
      visit edit_user_registration_path(user)

      clear_emails
    end

    subject { user_account_edit_page }

    scenario 'user can change his pseudo and email', advanced: true do
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

    scenario 'user can change his password', advanced: true do
      user_account_edit_page.fill_in_password_account(user_info)

      expect(page).to have_content(t('devise.registrations.updated'))
    end

    scenario 'user can delete his account', advanced: true do
      expect {
        click_link t('devise.registrations.cancel.link_name')
      }.to change(User, :count).by(-1)
    end
  end

end
