class SitePage
  include ActionView::RecordIdentifier
  include Capybara::DSL
  include Rails.application.routes.url_helpers
  include AbstractController::Translation
  include Features::SessionHelpers
  include Features::FormHelpers

  def id_for(model, action = nil)
    '#' + dom_id(model, action)
  end

  def class_for(model)
    dom_class(model)
  end

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

  def header
    find('header nav')
  end

  def flash
    find('.flash')
  end

  def breadcrumb
    find('ol.breadcrumb')
  end

  def footer
    find('footer')
  end

  # Define a defaut path and return self to call another method on itself
  def visit
    super path
    self
  end
end
