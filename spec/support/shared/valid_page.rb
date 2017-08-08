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
    if content[:admin]
      is_expected.to have_title(titleize_admin(content[:title]))
    else
      is_expected.to have_title(titleize(content[:title]))
    end

    # Header
    unless content[:full_page]
      if content[:admin]
        is_expected.to have_css('header.blog-header.admin-header nav')
      else
        is_expected.to have_css('header.blog-header nav')
      end

      within content[:current_page].header do
        is_expected.to have_link(ENV['WEBSITE_NAME'], href: root_path)

        is_expected.to have_selector('a.search-toggle', text: 'search')

        if content[:connected]
          is_expected.to have_selector("a[href=\"#{logout_path}\"]", text: /#{t('views.header.log_out')}/i, visible: false)
        else
          # is_expected.to have_selector('a[href="#home-contact"]', text: /#{t('views.header.contact')}/i)

          is_expected.to have_selector("a[href=\"#{signup_path}\"]", text: /#{t('views.header.sign_up')}/i, visible: false)
          is_expected.to have_selector("a[href=\"#{login_path}\"]", text: /#{t('views.header.log_in')}/i, visible: false)
        end
      end unless content[:admin]
    end

    # Footer
    unless content[:full_page] || content[:admin]
      is_expected.to have_css('footer.blog-footer')

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

    # Copyright
    unless content[:full_page] || content[:admin]
      within content[:current_page].footer do
        is_expected.to have_css('.footer-copyright')
        is_expected.to have_content(/#{t('views.copyright', website: ENV['WEBSITE_NAME'])}/i)
      end
    end
  end
end
