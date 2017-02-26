require 'support/helpers/session_helpers'
require 'support/helpers/form_helpers'

class SitePage
  include ActionView::RecordIdentifier
  include Capybara::DSL
  include Rails.application.routes.url_helpers
  include AbstractController::Translation
  include Features::SessionHelpers
  include Features::FormHelpers

  HTMLValidation.show_warnings = false

  Capybara::Screenshot.autosave_on_failure = false

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
      has_selector?("link[href*='#{css_name}']", visible: false)
    else
      has_selector?("link[rel='stylesheet'][href*='application']", visible: false)
    end
  end

  def has_javascript?(script_name=nil)
    has_selector?("script[src*='#{script_name}']", visible: false)
  end

  def has_javascript_errors?
    if page.driver.console_messages.length > 0
      ap page.driver.console_messages
      return true
    else
      return false
    end
  end

  def has_language?(language, lg)
    has_selector?("#language-dropdown a[href='/?locale=#{lg}']", text: t("views.header.language.#{language}"), visible: false)
  end
end

# Define "content" variable in a block as parameter
# it_behaves_like 'a valid page' do
#   let(:content) { {title: 'title'} }
# end

shared_examples 'a valid page' do
  scenario 'is the correct page' do
    uri  = URI.parse(current_url)
    path = uri.path + (uri.query ? '?' + uri.query : '')

    expect(path).to eq(content[:current_page].path)
  end

  scenario 'has the correct title' do
    if content[:admin]
      is_expected.to have_title(titleize_admin(content[:title]))
    else
      is_expected.to have_title(titleize(content[:title]))
    end
  end

  scenario 'contains the correct stylesheets' do
    # is_expected.to have_stylesheet 'application'

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
    unless content[:full_page]
      if content[:admin]
        is_expected.to have_css('header.loca-header.admin-header nav')
      else
        is_expected.to have_css('header.loca-header nav')
      end

      within content[:current_page].header do
        is_expected.to have_link(ENV['WEBSITE_NAME'], href: root_path)

        is_expected.to have_selector('a.search-toggle', text: 'search')

        # is_expected.to have_selector("a[href=\"#{explore_shops_fr_path}?trade=art\"]", text: /#{t('views.header.shop.art')}/i, visible: false)

        if content[:connected]
          is_expected.to have_selector("a[href=\"#{logout_fr_path}\"]", text: /#{t('views.header.log_out')}/i, visible: false)
        else
          # is_expected.to have_selector('a[href="#home-contact"]', text: /#{t('views.header.contact')}/i)

          is_expected.to have_selector("a[href=\"#{signup_fr_path}\"]", text: /#{t('views.header.sign_up')}/i, visible: false)
          is_expected.to have_selector("a[href=\"#{login_fr_path}\"]", text: /#{t('views.header.log_in')}/i, visible: false)
        end
      end unless content[:admin]
    end
  end

  # scenario 'user can see flash messages', basic: true do
  #   is_expected.to have_selector('div#toast-container')
  # end

  scenario 'has a correct footer' do
    unless content[:full_page] || content[:admin]
      is_expected.to have_css('footer.loca-footer')

      within content[:current_page].footer do
        is_expected.to have_link(t('views.footer.blog'), href: blog_path)
        is_expected.to have_link(t('views.footer.about_us'), href: about_us_path)
        is_expected.to have_link(t('views.footer.terms_of_use'), href: terms_path)
        is_expected.to have_link(t('views.footer.privacy'), href: privacy_path)
        is_expected.to have_link(t('views.footer.contact'), href: contact_path)
        is_expected.to have_link(t('views.footer.support'), href: support_path)
        is_expected.to have_link(t('views.footer.media'), href: media_path)
      end
    end
  end

  scenario 'user can see the copyright' do
    unless content[:full_page] || content[:admin]
      within content[:current_page].footer do
        is_expected.to have_css('.footer-copyright')
        is_expected.to have_content(/#{t('views.copyright', website: ENV['WEBSITE_NAME'])}/i)
      end
    end
  end
end
