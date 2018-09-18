# frozen_string_literal: true

require 'support/pages/site_page'

class TagPage < SitePage
  attr_accessor :tag_page

  def initialize(tag_page)
    @tag_page = tag_page
  end

  def path
    @tag_page
  end

end
