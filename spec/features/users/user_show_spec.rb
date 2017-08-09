feature 'User Show page', advanced: true, js: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_show_page) { UserPage.new(user_path(@user)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    user_show_page.visit
  end

  subject { user_show_page }

  feature 'Page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: user_show_page,
          title:        t('views.user.show.title', pseudo: @user.pseudo),
          asset_name:   'users/show',
          common_js:    ['commons'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'User Show content' do
    scenario 'user can his account' do
      is_expected.to have_content(@user.pseudo)
      is_expected.to have_content(@user.first_name)
      is_expected.to have_content(@user.last_name)
    end
  end

end
