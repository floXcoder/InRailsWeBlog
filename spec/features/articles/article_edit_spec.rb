# frozen_string_literal: true

feature 'Article Edit page', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @tags            = create_list(:tag, 3, user: @user)
    @article         = create(:article_with_tags, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
    @private_article = create(:article, user: @user, topic: @topic, visibility: 'only_me')
  end

  given(:edit_article_page) { ArticlePage.new(edit_article_path(@article.id)) }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    edit_article_page.visit
  end

  subject { edit_article_page }

  feature 'user can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: edit_article_page,
          title:        t('views.article.edit.title', title: @article.title),
          asset_name:   'articles/edit',
          common_js:    ['commons'],
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
