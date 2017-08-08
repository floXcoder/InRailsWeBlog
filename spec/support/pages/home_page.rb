require 'support/pages/site_page'

class HomePage < SitePage
  attr_accessor :home_page

  def initialize(home_page = nil)
    @home_page = home_page || root_path
  end

  def path
    @home_page
  end

  def head
    find('head', visible: false)
  end

  def header
    find('header nav')
  end
end
