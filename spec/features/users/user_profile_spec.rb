feature 'User Profile', advanced: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_profile_page)   { UserPage.new(user_profile_path(@user)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    user_profile_page.visit
  end

  subject { user_profile_page }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_profile_page,
            title: t('views.user.profile.title'),
            asset_name: 'users/profile',
            common_js: ['commons'],
            connected: true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
