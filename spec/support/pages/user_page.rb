# frozen_string_literal: true

require 'support/pages/site_page'

class UserPage < SitePage
  attr_accessor :user_page

  def initialize(user_page)
    @user_page = user_page
  end

  def path
    @user_page
  end

end
