feature 'User Password', advanced: true do

  background(:all) do
    @user = create(:user, :confirmed, email: user_info[:email])
  end

  given(:user_info) { {pseudo: 'Pseudo',
                       email: 'test@locatipic.fr',
                       password: 'new_password'}
  }

  given(:new_password_page) { UserPage.new(new_user_password_path) }
  given(:edit_password_page) { UserPage.new(edit_user_password_path) }

  background do
  end

  feature 'New Password page', js: true do
    background do
      new_password_page.visit
    end

    subject { new_password_page }

    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: new_password_page,
            title: t('devise.passwords.new.title'),
            stylesheet_name: 'users/new',
            javascript_name: 'users/password',
            common_js: ['commons-full-page'],
            full_page: true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  # feature 'Edit Password page', advanced: true, js: true do
  #   background do
  #     visit edit_user_password_path(reset_password_token: Devise.friendly_token)
  #   end
  #
  #   subject { edit_password_page }
  #
  #   it_behaves_like 'a valid page' do
  #     let(:content) {
  #       {
  #           current_page: edit_password_page,
  #           title: t('devise.passwords.edit.title'),
  #           stylesheet_name: 'users/new',
  #           javascript_name: 'users/password',
  #           common_js: ['commons-full-page']
  #       }
  #     }
  #   end
  #
  #   scenario 'page has a valid HTML structure' do
  #     is_expected.to have_valid_html
  #   end
  # end

  # feature 'Change password', advanced: true do
  #   background do
  #     clear_emails
  #   end
  #
  #   subject { edit_password_page }
  #
  #   scenario 'user can send to him an email to get a new password', advanced: true do
  #     new_password_page.visit
  #
  #     within ('form#password_user') do
  #       fill_in :user_email, with: user_info[:email]
  #       click_button t('devise.passwords.new.submit')
  #     end
  #
  #     sleep 0.5
  #
  #     # process_email
  #
  #     open_email(user_info[:email])
  #
  #     current_email.save_and_open
  #
  #     expect(current_email).to have_content(t('email.hello'))
  #     expect(current_email).to have_content(t('email.reset_password.instruction'))
  #     expect(current_email).to have_link(t('devise.confirmations.link_name'), href: user.reset_password_token)
  #     expect(current_email).to have_content(t('email.greeting'))
  #
  #     current_email.click_link(t('devise.confirmations.link_name'))
  #     expect(page).to have_content(t('devise.passwords.edit.title'))
  #
  #     within ('input#new_user') do
  #       fill_in :user_password, with: user_info[:password]
  #       fill_in :user_password_confirmation, with: user_info[:password]
  #       click_button t('devise.passwords.edit.submit')
  #     end
  #   end
  # end

end
