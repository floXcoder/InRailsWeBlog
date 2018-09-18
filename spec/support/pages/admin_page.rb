# frozen_string_literal: true

require 'support/pages/site_page'

class AdminPage < SitePage
  attr_accessor :admin_page

  def initialize(admin_page)
    @admin_page = admin_page
  end

  def path
    @admin_page
  end

end
