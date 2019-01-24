# frozen_string_literal: true

feature 'Tagged articles', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user, visibility: :everyone)

    @tags     = create_list(:tag, 2, user: @user)
    @articles = create_list(:article, 3, user: @user, topic: @topic, tags: [@tags[0], @tags[1]])
  end

  given(:tagged_page) { TagPage.new("/tagged/#{@tags.first.slug}") }

  background do
    tagged_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { tagged_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tagged_page,
          title:        I18n.t('views.article.index.title.tagged', tag: @tags.first.name),
          asset_name:   'assets/home',
          common_js:    ['assets/runtime', 'assets/home']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Tagged articles content' do
    scenario 'visitor can see the articles' do
      is_expected.to have_css('article', count: 3)
      is_expected.to have_content(@articles.first.title)
    end

    # scenario 'visitor can see article sidebar' do
    #   is_expected.to have_css("h2[class*='ArticleSidebar-title-']")
    #   is_expected.to have_css("div[class*='ArticleSidebar-timeline-']")
    # end
    #
    # scenario 'visitor can see tag sidebar' do
    #   is_expected.to have_css("div[class*='TagSidebar-list-']")
    #   is_expected.to have_css("a[class*='TagSidebar-tagList-']", count: 2)
    # end
  end

end
