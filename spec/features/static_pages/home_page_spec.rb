feature 'Home page', advanced: true do

  given(:homepage) { HomePage.new }

  background { visit root_path }

  subject { homepage }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
            current_page: homepage,
            title: '',
            asset_name: 'home',
            common_js: ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Sidebar', js: true do
    scenario 'is displayed' do
      is_expected.to have_css('.col.s3.blog-sidebar')
    end
  end


end
