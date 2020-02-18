# frozen_string_literal: true

feature 'Tag index for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags     = create_list(:tag, 2, user: @user)
    @articles = create_list(:article, 3, user: @user, topic: @topic, tags: [@tags[0], @tags[1]])
  end

  given(:tags_page) { TagPage.new("/users/#{@user.slug}/topics/#{@topic.slug}/tags") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    tags_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { tags_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tags_page,
          # title:        I18n.t('views.tag.index.title.topic', topic: @topic.name),
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

  feature 'Tag index content for owner' do
    scenario 'owner can see the tags' do
      is_expected.to have_css("div[class*='TagIndex-tagCard-']", count: 2)
      is_expected.to have_content(@tags.first.name)
      is_expected.to have_content(@tags.second.name)
    end

    scenario 'owner can sort tags by priority' do
      # is_expected.to have_link(I18n.t('js.tag.index.sort'), href: "/tags/#{@user.slug}/sort")
    end

    scenario 'users can see the topic sidebar' do
      is_expected.to have_css("ul[class*='TagSidebar-tagList-']")
    end
  end

end
