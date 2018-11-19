# frozen_string_literal: true

feature 'Article Show page for visitors', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags    = create_list(:tag, 3, user: @user)
    @article = create(:article, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
  end

  given(:article_page) { ArticlePage.new("/users/#{@article.user.slug}/articles/#{@article.slug}") }

  background do
    logout(:user)
    article_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { article_page }

  feature 'visitor can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: article_page,
          title:        t('views.article.show.title', title: @article.title),
          asset_name:   'assets/home',
          common_js:    ['assets/runtime', 'assets/home']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Article Show content' do
    scenario 'visitor can show an article' do
      is_expected.to have_css('article')

      is_expected.to have_css('h1', text: /#{@article.title}/i)

      is_expected.to have_css('.normalized-content')

      is_expected.to have_content(/#{@article.tags[0]}/i)
      is_expected.to have_content(/#{@article.tags[1]}/i)
      is_expected.to have_content(/#{@article.tags[2]}/i)
    end

    scenario 'visitor do not see edit links' do
      is_expected.not_to have_css("a[href*='/users/#{@article.user.slug}/articles/#{@article.slug}/edit']")
    end
  end

end
