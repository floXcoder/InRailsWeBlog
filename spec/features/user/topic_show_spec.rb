# frozen_string_literal: true

feature 'Topic show for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags     = create_list(:tag, 2, user: @user)
    @articles = create_list(:article, 3, user: @user, topic: @topic, tags: [@tags[0], @tags[1]])
  end

  given(:topic_page) { TopicPage.new("/users/#{@user.slug}/topics/#{@topic.slug}") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    topic_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { topic_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: topic_page,
          title:        I18n.t('views.article.index.title.topic', topic: @topic.name),
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

  feature 'Topic Show content for owner' do
    scenario 'owner can see the articles' do
      is_expected.to have_css('article', count: 3)
      is_expected.to have_content(@articles.first.title)
    end

    scenario 'users can change display' do
      is_expected.to have_css("button[class*='ArticleAppendixDisplay-fabButton-']")
    end

    scenario 'users can see the topic sidebar' do
      is_expected.to have_css("ul[class*='TagSidebar-root-']")
    end
  end

end
