# frozen_string_literal: true

feature 'Article Edit page for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags    = create_list(:tag, 3, user: @user)
    @article = create(:article, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
  end

  given(:edit_article_page) { ArticlePage.new("/users/#{@article.user.slug}/articles/#{@article.slug}/edit") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    edit_article_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { edit_article_page }

  feature 'user can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: edit_article_page,
          title:        t('views.article.edit.title', title: @article.title, topic: @topic.name),
          asset_name:   'assets/user',
          common_js:    ['assets/user'],
          connected:    true
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Article Edit content' do
    scenario 'user can edit an article' do
      # is_expected.to have_css("#edit-article-#{@article.id}")
      #
      # is_expected.to have_css('.article-title')
      # is_expected.to have_content(/#{I18n.t('js.article.edit.title', name: @article.title)}/i)
      #
      # is_expected.to have_field(:article_title, with: @article.title)
      # is_expected.to have_submit_button(I18n.t('js.article.edit.submit'))
      #
      # is_expected.to have_link(I18n.t('js.article.edit.back_to_article'), href: article_path(@article))
    end
  end

end
