feature 'Article Show page', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @tags            = create_list(:tag, 3, user: @user)
    @article         = create(:article_with_tags, user: @user, topic: @topic, tags: [@tags[0], @tags[1], @tags[2]])
    @private_article = create(:article, user: @user, topic: @topic, visibility: 'only_me')
  end

  given(:article_page) { ArticlePage.new(article_path(@article)) }

  background do
    article_page.visit
  end

  subject { article_page }

  feature 'user can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: article_page,
          title:        t('views.article.show.title', title: @article.title),
          asset_name:   'articles/show',
          common_js:    ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Article Show content' do
    scenario 'user can show an article' do
      # is_expected.to have_css('.article-details')
      # is_expected.to have_css('.article-breadcrumb')
      #
      # is_expected.to have_css('.article-title')
      # is_expected.to have_content(/#{@article.title}/i)
      # is_expected.to have_content(@article.summary)
      #
      # is_expected.to have_css('.article-description')
      #
      # is_expected.to have_css("#article-comment-#{@article.id}", visible: false)
    end

    scenario 'visitor do not see edit links' do
      # is_expected.not_to have_link(I18n.t('js.article.show.edit_link'), href: edit_article_path(@article.id))
    end
  end

  feature 'Article Show content for owner' do
    background do
      login_as(@user, scope: :user, run_callbacks: false)
    end

    scenario 'owner can edit the article' do
      # is_expected.to have_content(/#{I18n.t('js.article.show.edit_link')}/i)
    end
  end

end
