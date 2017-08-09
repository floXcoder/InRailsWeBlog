feature 'Admin Index page', advanced: true, js: true do

  background(:all) do
    @admin = create(:admin)
    # @admin = create(:admin, :with_blog)
  end

  given(:admin_page) { AdminPage.new(admin_path) }

  background do
    login_as(@admin, scope: :admin, run_callbacks: false)
    admin_page.visit
  end

  subject { admin_page }

  feature 'Page' do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          admin:        true,
          current_page: admin_page,
          title:        t('views.admin.dashboard.title'),
          asset_name:   'admin/admin',
          common_js:    ['commons-admin']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Admin index content' do
    scenario 'user can admin categories' do
      # TODO
      # is_expected.to have_css('.admin-search')
      # is_expected.to have_css('input#admin-search-input')
      # is_expected.to have_css('.admin-item', minimum: 12)
    end
  end

end
