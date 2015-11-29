module ApplicationHelper

  def w(msg)
    Rails.logger.ap msg, :warn
  end

  def full_title(page_title)
    base_title = t('common.website_name')
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title.html_safe}"
    end
  end

  def nav_brand
    if user_signed_in?
      link_to t('common.website_name'), root_user_path(current_user), class: 'navbar-brand'
    else
      link_to t('common.website_name'), root_path, class: 'navbar-brand'
    end
  end

  def navbar_link(link_name, link_path, options = {})
    options = { class: "#{'active' if current_page?(link_path)}" }.merge(options)
    link_to link_name, link_path, options
  end

  def format_datetime(date)
    I18n.l(date, format: :custom)
  end

  def format_date(date)
    I18n.l(date, format: :custom_full_date)
  end

  def format_distance_k(distance)
    (distance / 1000.0).round(2)
  end

  def shorten_text(text, length = 60)
    return '' unless text

    end_line = text.html_safe.index(' ', length - 10)
    if end_line && text.html_safe.length > length
      desc = text[0...end_line] + '...'
      desc.html_safe
    else
      text.html_safe
    end
  end

  def javascript(*files)
    content_for(:javascript) { javascript_include_tag(*files) }
  end

  def stylesheet(*files)
    content_for(:stylesheet) { stylesheet_link_tag(*files) }
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

end
