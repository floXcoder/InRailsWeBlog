feature 'User Show page' do

  given(:user)              { FactoryGirl.create(:user, :confirmed) }
  given(:user_show_page)  { UserPage.new(user_path(user)) }

  background do
    login_with(user.email, user.password)
    visit user_path(user)
  end

  subject { user_show_page }

  feature 'Page', js: true, basic: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: user_show_page,
            title: t('views.user.show.page_title', pseudo: user.pseudo),
            asset_name: 'users/show',
            common_js: %w(commons common-user)
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
