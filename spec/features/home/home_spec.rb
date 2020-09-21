# frozen_string_literal: true

feature 'Home page for visitors', advanced: true, js: true do

  background(:all) do
    @user = create(:user)

    @topic = create(:topic, visibility: 'everyone', user: @user)

    @tags     = create_list(:tag, 2, visibility: 'everyone', user: @user)
    @articles = create_list(:article, 3, visibility: 'everyone', user: @user, topic: @topic, tags: [@tags[0], @tags[1]])
  end

  given(:homepage) { HomePage.new }

  background do
    logout(:user)
    homepage.visit
    page.driver.browser.navigate.refresh
  end

  subject { homepage }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: homepage,
          # title:        I18n.t('views.home.title'),
          asset_name:   'assets/default',
          common_js:    ['assets/default']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Home page content' do
    scenario 'visitor can see populars articles' do
      is_expected.to have_content(I18n.t('js.views.home.articles.title'))
      is_expected.to have_css('article', count: 3)
      is_expected.to have_content(@articles.first.title)
    end

    scenario 'visitor can see populars tags' do
      is_expected.to have_content(I18n.t('js.views.home.tags.title'))
      is_expected.to have_css("a[class*='TagChipDisplay-tagChip-']", count: 2)
      is_expected.to have_content(@tags.first.name)
    end

    scenario 'visitor cannot see the sidebar' do
      is_expected.not_to have_css("div[class*='TagSidebar-list-']")
    end
  end

end
