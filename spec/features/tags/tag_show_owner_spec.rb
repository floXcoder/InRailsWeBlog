# frozen_string_literal: true

feature 'Tag show for owners', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @topic = create(:topic, user: @user)

    @tags     = create_list(:tag, 2, user: @user)
    @articles = create_list(:article, 3, user: @user, topic: @topic, tags: [@tags[0], @tags[1]])
  end

  given(:tag_page) { TagPage.new("/tags/#{@tags.first.slug}") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    tag_page.visit
  end

  subject { tag_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tag_page,
          title:        I18n.t('views.tag.show.title', name: @tags.first.name),
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

  feature 'Tag show content for owner' do
    scenario 'owner can see the tag details' do
      is_expected.to have_css('h1', text: @tags.first.name)
      is_expected.to have_content(t('js.tag.model.parents'))
      is_expected.to have_content(t('js.tag.model.children'))
    end

    scenario 'users can edit the tag' do
      is_expected.to have_link(I18n.t('js.tag.show.edit_link'), href: "/tags/#{@tags.first.slug}/edit")
    end

    scenario 'users can see the topic sidebar' do
      is_expected.to have_css("ul[class*='TagSidebar-root-']")
    end
  end

end
