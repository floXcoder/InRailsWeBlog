feature 'Home page', advanced: true, js: true do

  given(:homepage) { HomePage.new }

  background do
    logout
    visit root_path
  end

  subject { homepage }

  feature 'Page', js: true do
    it_behaves_like 'a valid page' do
      let(:content) {
        {
          current_page: homepage,
          title:        '',
          asset_name:   'home',
          common_js:    ['commons']
        }
      }
    end

    scenario 'page has a valid HTML structure' do
      is_expected.to have_valid_html
    end
  end

  feature 'Home page content' do
    scenario 'use can see the sidebar' do
      # is_expected.to have_css('.col.s3.blog-sidebar')
    end

    scenario 'use can see the main section' do
      # is_expected.to have_css('.blog-home')
      # is_expected.to have_content(I18n.t('js.views.home.header.title'))
      #
      # is_expected.to have_css('.blog-pre-main')
      #
      # is_expected.to have_css('.container.blog-main')
      # is_expected.to have_css('.search-affiliations')
      # is_expected.to have_css('.home-around-me')
      # is_expected.to have_css('.home-join')
      #
      # is_expected.to have_css('.blog-post-main')
    end

    scenario 'user can search' do
      # is_expected.to have_css('input#blogtion-input')
      # is_expected.to have_css('input.react-autosuggest__input')
      # is_expected.to have_css('input#search-submit')
    end
  end

end
