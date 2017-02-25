feature 'Error Show page', advanced: true do

  given(:error_page) { ErrorsPage.new('/404') }

  background do
    error_page.visit
  end

  subject { error_page }

  feature 'admin can see the page', advanced: true, js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          full_page: true,
          current_page: error_page,
          title: '',
          asset_name: 'errors/error',
          common_js: ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

end
