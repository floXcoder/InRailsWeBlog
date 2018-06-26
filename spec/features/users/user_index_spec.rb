feature 'User Index page', advanced: true, js: true do

  background(:all) do
    @users = create_list(:user, 3)
  end

  given(:user_index_page) { UserPage.new(users_path) }

  background do
    user_index_page.visit
  end

  subject { user_index_page }

  feature 'user can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: user_index_page,
          title:        t('views.user.index.title'),
          asset_name:   'users/index',
          common_js:    ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'User Index content' do
    scenario 'user can show all users' do
      # is_expected.to have_css('.user-card', minimum: 3)
    end
  end

end
