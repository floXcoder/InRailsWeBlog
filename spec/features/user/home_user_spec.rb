# frozen_string_literal: true

feature 'Home User page for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @public_topic = create(:topic, visibility: 'everyone', user: @user)
    @tags         = create_list(:tag, 2, visibility: 'everyone', user: @user)
    @articles     = create_list(:article, 3, visibility: 'everyone', user: @user, topic: @public_topic, tags: [@tags[0], @tags[1]])

    @private_topic = create(:topic, visibility: 'only_me', user: @user)
  end

  given(:homepage) { HomePage.new }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    homepage.visit
    page.driver.browser.navigate.refresh
  end

  subject { homepage }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: homepage,
          title:        I18n.t('views.user.show.title', pseudo: @user.pseudo),
          asset_name:   'assets/user',
          common_js:    ['assets/runtime', 'assets/user'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Home page content' do
    scenario 'users can see private themes' do
      is_expected.to have_content(I18n.t('js.user.home.private.title'))
      is_expected.to have_css("div[class*='UserHome-theme-']")
      is_expected.to have_content(@public_topic.name)
    end

    scenario 'users can see public themes' do
      is_expected.to have_content(I18n.t('js.user.home.public.title'))
      is_expected.to have_css("div[class*='UserHome-theme-']")
      is_expected.to have_content(@private_topic.name)
    end

    scenario 'users can see the sidebar' do
      is_expected.to have_css("div[class*='TagSidebar-cloudList-']")
      is_expected.to have_css("a[class*='TagSidebar-cloudTag-']", count: 2)
    end
  end

end
