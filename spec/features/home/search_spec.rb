# frozen_string_literal: true

feature 'Search for visitors', advanced: true, js: true, search: true do

  background(:all) do
    @user = create(:user)

    @topic = create(:topic, visibility: 'everyone', user: @user)

    @tags     = create_list(:tag, 2, visibility: 'everyone', user: @user)
    @articles = create_list(:article, 3, visibility: 'everyone', user: @user, topic: @topic, tags: [@tags[0], @tags[1]])

    @query = '*'

    Article.reindex
    Article.search_index.refresh
    Tag.reindex
    Tag.search_index.refresh
    Topic.reindex
    Topic.search_index.refresh
  end

  given(:search_page) { SearchPage.new("/search?query=#{@query}") }

  background do
    logout(:user)
    search_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { search_page }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page:     search_page,
          # title:            I18n.t('views.search.index.title', query: @query),
          no_search_header: true,
          asset_name:       'assets/default',
          common_js:        ['assets/default']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Home page content' do
    scenario 'visitor can see search form' do
      is_expected.to have_css('input[type="search"]', count: 1)
    end

    scenario 'visitor can see the results' do
      is_expected.to have_content(I18n.t('js.search.index.results', count: @articles.count))
      is_expected.to have_content(I18n.t('js.search.index.results', count: @articles.count))
      is_expected.to have_css('article', count: @articles.count)
    end
  end

end
