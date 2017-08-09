feature 'Tag Show page', advanced: true, js: true do

  background(:all) do
    @user       = create(:user)
    @other_user = create(:user)

    @tag = create(:tag, user: @user)
  end

  given(:tag_page) { TagPage.new(tag_path(@tag)) }

  background do
    tag_page.visit
  end

  subject { tag_page }

  feature 'user can see the page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: tag_page,
          title:        t('views.tag.show.title', title: @tag.name),
          asset_name:   'tags/show',
          common_js:    ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Tag Show content' do
    scenario 'user can show an tag' do
      # is_expected.to have_css('.tag-details')
      # is_expected.to have_css('.tag-breadcrumb')
      #
      # is_expected.to have_css('.tag-title')
      # is_expected.to have_content(/#{@tag.title}/i)
      # is_expected.to have_content(@tag.summary)
      #
      # is_expected.to have_css('.tag-description')
      #
      # is_expected.to have_css("#tag-comment-#{@tag.id}", visible: false)
    end

    scenario 'visitor do not see edit links' do
      # is_expected.not_to have_link(I18n.t('js.tag.show.edit_link'), href: edit_tag_path(@tag.id))
    end
  end

  feature 'Tag Show content for owner' do
    background do
      login_as(@user, scope: :user, run_callbacks: false)
    end

    scenario 'owner can edit the tag' do
      # is_expected.to have_content(/#{I18n.t('js.tag.show.edit_link')}/i)
    end
  end

end
