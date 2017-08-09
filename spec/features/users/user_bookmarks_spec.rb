feature 'User Bookmarks', advanced: true, js: true do

  background(:all) do
    @user = create(:user)
  end

  given(:user_bookmarks_page) { UserPage.new(user_bookmarks_path(@user)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    user_bookmarks_page.visit
  end

  subject { user_bookmarks_page }

  feature 'Page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: user_bookmarks_page,
          title:        t('views.user.bookmarks.title'),
          asset_name:   'users/bookmarks',
          common_js:    ['commons'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
