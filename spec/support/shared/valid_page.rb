# frozen_string_literal: true

require 'support/pages/site_page'

shared_examples 'a valid page' do
  scenario 'contains the assets with no errors' do
    # URL
    uri  = URI.parse(current_url)
    path = uri.path + (uri.query ? '?' + uri.query : '')
    expect(path).to eq(content[:current_page].path)

    # Stylesheets
    if content[:asset_name]
      is_expected.to have_stylesheet content[:asset_name]
    elsif content[:stylesheet_name]
      is_expected.to have_stylesheet content[:stylesheet_name]
    end

    # Javascripts
    content[:common_js].each do |common_file|
      is_expected.to have_javascript common_file
    end

    if content[:asset_name]
      is_expected.to have_javascript content[:asset_name]
    elsif content[:javascript_name]
      is_expected.to have_javascript content[:javascript_name]
    end

    # No JS errors
    is_expected.not_to have_javascript_errors
  end

  scenario 'has the correct layout' do
    # Correct title
    is_expected.to have_title(titleize(content[:title]))

    # Header
    is_expected.to have_css('header')

    within content[:current_page].header do
      is_expected.to have_link(ENV['WEBSITE_NAME'], href: root_path)

      is_expected.to have_selector('form.blog-search-header') unless content[:no_search_header]

      if content[:connected]
        is_expected.to have_css(".header-button", count: 3)
      else
        is_expected.to have_css("button", text: /#{t('js.views.header.user.sign_up')}/i)
        is_expected.to have_selector("button", text: /#{t('js.views.header.user.log_in')}/i)
      end
    end

    # Link in dropdown outside header
    if content[:connected]
      is_expected.to have_selector("a[href=\"#{logout_path}\"]", visible: false)
    end

    # Footer
    is_expected.not_to have_css('footer')

    # # Copyright
    # within content[:current_page].footer do
    #   is_expected.to have_css('.footer-copyright')
    #   # is_expected.to have_content(/#{t('views.copyright', website: ENV['WEBSITE_NAME'])}/i)
    # end
  end
end
