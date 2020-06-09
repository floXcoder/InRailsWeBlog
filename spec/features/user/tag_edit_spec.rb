# frozen_string_literal: true

feature 'Tag edit for users', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)

    @topic = create(:topic, user: @user)

    @tags = create_list(:tag, 2, user: @user)
  end

  given(:tag_page) { TagPage.new("/tags/#{@tags.first.slug}/edit") }

  background do
    login_as(@user, scope: :user, run_callbacks: false)
    tag_page.visit
    page.driver.browser.navigate.refresh
  end

  subject { tag_page }

  feature 'owner can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tag_page,
          # title:        I18n.t('views.tag.edit.title', name: @tags.first.name),
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

  feature 'Tag edit content for owner' do
    scenario 'owner can edit the tags' do
      is_expected.to have_css('input#tag_name')
      is_expected.to have_css('.note-editor.note-frame')
    end

    # No sidebar for tag edit
    # scenario 'users can see the tag sidebar' do
    #   is_expected.to have_css("div[class*='TagSidebar-cloudList-']")
    # end
  end

end
