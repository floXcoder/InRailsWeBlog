# frozen_string_literal: true

require 'support/pages/site_page'

class SearchPage < SitePage
  attr_accessor :search_page

  def initialize(search_page = nil)
    @search_page = search_page || root_path
  end

  def path
    @search_page
  end
end
