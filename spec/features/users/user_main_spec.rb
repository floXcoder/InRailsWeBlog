feature 'User Main page' do

  given(:user)            { FactoryGirl.create(:user, :confirmed) }
  given(:user_main_page)  { UserPage.new(root_user_path(user)) }

  background do
    login_with(user.email, user.password)
    visit root_user_path(user)
  end

  subject { user_main_page }

  feature 'Page', js: true, basic: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_main_page,
            title: t('views.user.main.page_title', pseudo: user.pseudo),
            asset_name: 'users/main',
            common_js: %w(commons common-user)
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
