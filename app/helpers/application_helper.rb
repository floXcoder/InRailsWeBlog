# frozen_string_literal: true

module ApplicationHelper
  def localized_routes
    routes = {}

    I18n.available_locales.each do |locale|
      routes[locale]          = I18n.t('routes', locale: locale).dup
      routes[locale][:home]   = '/' if routes[locale][:home].empty?
      routes[locale][:locale] = "/#{locale}" if locale != :en
    end

    return routes
  end

  def titleize(page_title)
    base_title = page_title
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?

    base_title.html_safe
  end

  def titleize_admin(page_title)
    base_title = "(ADMIN) | #{page_title}"
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?

    base_title.html_safe
  end

  def javascript(file, **options)
    AssetManifest.associated_javascripts(file).each do |type, js_files|
      js_files.each do |js_file|
        if type == :initial
          content_for(:javascript_initial) { javascript_include_tag(js_file, **options) }
        elsif type == :original
          content_for(:javascript) { javascript_include_tag(js_file, **options) }
        end
      end
    end
  end

  def stylesheet(*files, **options)
    files.each do |file|
      content_for(:stylesheet) { stylesheet_link_tag(AssetManifest.stylesheet_path(file), media: 'all', **options) }
    end
  end

  def image_url(url)
    AssetManifest.image_path(url)
  end

  def favicon(file, **options)
    favicon_link_tag(image_path(file), options)
  end

  def translations(file)
    content_for(:translations) { raw Rails.root.join("public/assets/translations/#{file}.json").read }
  end
end
