require 'support/pages/site_page'

class HomePage < SitePage
  # Store URL path
  def path
    root_path
  end

  # def head
  #   find('head', visible: false)
  # end
  #
  # def header
  #   find('header nav')
  # end
end
