feature 'User Profile page', advanced: true, js: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_profile_page) { UserPage.new(profile_user_path(@user)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    user_profile_page.visit
  end

  subject { user_profile_page }

  feature 'Page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: user_profile_page,
          title:        t('views.user.profile.title'),
          asset_name:   'users/profile',
          common_js:    ['commons'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'User Profile content' do
    scenario 'user can show his profile' do
      is_expected.to have_content(@user.pseudo)
      is_expected.to have_content(@user.first_name)
      is_expected.to have_content(@user.last_name)

      is_expected.to have_link(I18n.t('js.user.profile.edit'))
    end
  end

end
