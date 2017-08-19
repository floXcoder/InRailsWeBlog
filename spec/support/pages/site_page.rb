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
  def has_stylesheet?(css_name = nil)
    if css_name
      has_selector?("link[href*='#{css_name}']", visible: false)
    else
      has_selector?("link[rel='stylesheet'][href*='application']", visible: false)
    end
  end

  def has_javascript?(script_name = nil)
    has_selector?("script[src*='#{script_name}']", visible: false)
  end

  def has_javascript_errors?
    javascript_logs = page.driver.browser.manage.logs.get(:browser)
    # Ignore warnings and mapbox errors
    javascript_logs = javascript_logs.reject { |log| log.message.match?(/Warning:/) }
    javascript_logs = javascript_logs.reject { |log| log.message.match?(/WebSocket/) }

    if !javascript_logs.length.empty?
      ap javascript_logs.map(&:message)
      return true
    else
      return false
    end
  end

  def has_language?(language, lg)
    has_selector?("#language-dropdown a[href='/?locale=#{lg}']", text: t("views.header.language.#{language}"), visible: false)
  end
end
