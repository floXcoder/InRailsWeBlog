require 'support/pages/site_page'

class ErrorsPage < SitePage
  attr_accessor :error_page

  def initialize(error_page)
    @error_page = error_page
  end

  def path
    @error_page
  end

end
