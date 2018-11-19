# frozen_string_literal: true

feature 'Article Show page for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags    = create_list(:tag, 3, user: @user)
    @article = create(:article, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
  end

  given(:article_page) { ArticlePage.new("/users/#{@article.user.slug}/articles/#{@article.slug}") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    article_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { article_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: article_page,
          title:        t('views.article.show.title', title: @article.title),
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

  feature 'Article Show content for owner' do
    scenario 'owner can see the breadcrumb' do
      is_expected.to have_css('.article-breadcrumb')
      is_expected.to have_link(@article.user.pseudo, href: "/users/#{@article.user.slug}")
    end

    scenario 'owner can edit the article' do
      is_expected.to have_css("a[href='/users/#{@article.user.slug}/articles/#{@article.slug}/edit']")
    end
  end

end
