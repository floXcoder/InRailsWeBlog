feature 'User Show', advanced: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_show_page)   { UserPage.new(user_path(@user)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    user_show_page.visit
  end

  subject { user_show_page }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_show_page,
            title: t('views.user.show.title'),
            asset_name: 'users/show',
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
