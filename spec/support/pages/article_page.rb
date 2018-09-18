# frozen_string_literal: true

require 'support/pages/site_page'

class ArticlePage < SitePage
  attr_accessor :article_page

  def initialize(article_page)
    @article_page = article_page
  end

  def path
    @article_page
  end

end
