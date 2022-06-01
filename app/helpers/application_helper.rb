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

  def javascript(*files)
    files.each do |file|
      content_for(:javascript) { javascript_include_tag(file) }
    end
  end

  def javascript_defer(*files)
    files.each do |file|
      content_for(:javascript) { javascript_include_tag(file, defer: true) }
    end
  end

  def stylesheet(*files)
    files.each do |file|
      content_for(:stylesheet) { stylesheet_link_tag(file) }
    end
  end

  # Assets with manifest management
  def image_tag(url, options = {})
    url = AssetManifest.image_path(url)

    super(url, options)
  end

  def image_path(url, options = {})
    url = AssetManifest.asset_path(url)

    super(url, options)
  end

  def image_url(url, options = {})
    url = AssetManifest.asset_path(url)

    super(url, options)
  end
end
