class SitePage
  include ActionView::RecordIdentifier
  include Capybara::DSL
  include Rails.application.routes.url_helpers
  include AbstractController::Translation
  include Features::SessionHelpers
  include Features::FormHelpers

  # Define a default path and return self to call another method on itself
  def visit
    super path
    self
  end

  # Selectors
  def id_for(model, action = nil)
    '#' + dom_id(model, action)
  end

  def class_for(model)
    dom_class(model)
  end

  def header
    find('header nav')
  end

  def flash
    find('.flash')
  end

  def footer
    find('footer')
  end

  # Matchers
  def has_stylesheet?(css_name=nil)
    if css_name
      has_selector?("link[href*='#{css_name}.css']", visible: false)
    else
      has_selector?("link[rel='stylesheet'][href*='application.css']", visible: false)
    end
  end

  def has_javascript?(script_name=nil)
    has_selector?("script[src*='#{script_name}.js']", visible: false)
  end

  def has_javascript_errors?
    page.driver.console_messages.length != 0
  end
end

# Define "content" variable in a block as parameter
# it_behaves_like 'a valid page' do
#   let(:content) { {title: 'title'} }
# end
shared_examples 'a valid page' do
  scenario 'is the correct page' do
    expect(current_path).to eq(content[:current_page].path)
  end

  scenario 'has the correct title' do
    is_expected.to have_title(full_title(content[:title]))
  end

  scenario 'contains the correct stylesheets' do
    if content[:asset_name]
      is_expected.to have_stylesheet content[:asset_name]
    elsif content[:stylesheet_name]
      is_expected.to have_stylesheet content[:stylesheet_name]
    end
  end

  scenario 'contains the correct javascripts' do
    content[:common_js].each do |common_file|
      is_expected.to have_javascript common_file
    end
    if content[:asset_name]
      is_expected.to have_javascript content[:asset_name]
    elsif content[:javascript_name]
      is_expected.to have_javascript content[:javascript_name]
    end
  end

  scenario 'page has no Javascript errors' do
    is_expected.not_to have_javascript_errors
  end

  scenario 'has the correct header' do
    is_expected.to have_css('header.blog-header nav')
    within content[:current_page].header do
      is_expected.to have_link(t('common.website_name'), href: root_path)

      # is_expected.to have_content(t('views.header.articles'))
      # is_expected.to have_selector("a[href='/logout']", text: t('views.header.log_out'))
    end
  end

#   scenario 'user can see flash messages', basic: true do
#     visit new_user_session_path
#     is_expected.to have_css('.flash')
#   end
#
    scenario 'has a correct footer' do
      is_expected.to have_css('footer.page-footer.blog-footer')

      within content[:current_page].footer do
        is_expected.to have_link(t('footer.links.about'))
        is_expected.to have_link(t('footer.links.support'))
        is_expected.to have_content(t('footer.links.contact'))
      end
    end

    scenario 'user can see the copyright' do
      within content[:current_page].footer do
        is_expected.to have_content(t('footer.copyright'))
      end
    end

end
