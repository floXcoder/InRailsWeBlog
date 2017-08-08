module ApplicationHelper
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

  def nav_brand
    if user_signed_in?
      link_to ENV['WEBSITE_NAME'], root_user_path(current_user), class: 'navbar-brand'
    else
      link_to ENV['WEBSITE_NAME'], root_path, class: 'navbar-brand'
    end
  end

  def navbar_link(link_name, link_path, options = {})
    options = { class: "#{'active' if current_page?(link_path)}" }.merge(options)
    link_to link_name, link_path, options
  end

  def navbar_class(url)
    url = [url] unless url.is_a? Array

    if url.include? controller.controller_name
      'loca-header-active'
    end
  end

  def format_datetime(date)
    I18n.l(date, format: :custom)
  end

  def format_date(date)
    I18n.l(date, format: :custom_full_date)
  end

  def controller?(*controller)
    controller.include?(params[:controller])
  end

  def action?(*action)
    action.include?(params[:action])
  end

  def javascript(*files)
    files.each do |file|
      content_for(:javascript) { javascript_include_tag(file) }
    end
  end

  def javascript_defer(*files)
    files.each do |file|
      content_for(:javascript) { javascript_include_tag(file, defer: Rails.env.demo? || Rails.env.production?) }
    end
  end

  def stylesheet(*files)
    files.each do |file|
      content_for(:stylesheet) { stylesheet_link_tag(file) }
    end
  end

  # Assets with manifest management
  def javascript_include_tag(url, options={})
    url = AssetManifest.javascript_path(url)

    super(url, options)
  end

  def stylesheet_link_tag(url, options={})
    url = AssetManifest.stylesheet_path(url)

    super(url, options)
  end

  def image_tag(url, options={})
    url = AssetManifest.image_path(url)

    super(url, options)
  end

  def image_path(url, options={})
    url = AssetManifest.asset_path(url)

    super(url, options)
  end

  def image_url(url, options={})
    url = AssetManifest.asset_path(url)

    super((ActionController::Base.asset_host || '') + url, options)
  end

  def webmail_from_email(email)
    if email =~ /@(.*)\z/i
      case $1
        when 'gmail.com'
          %w[gmail https://mail.google.com/]
        when 'yahoo.com'
          %w[yahoo https://mail.yahoo.com/]
        when 'aol.com'
          %w[yahoo http://webmail.aol.fr/]
        when 'mobile.me'
          %w[apple https://www.icloud.com/]
        when 'outlook.com'
          %w[outlook https://www.outlook.com/]
        else
          false
      end
    else
      false
    end
  end
end
