# frozen_string_literal: true

require 'support/pages/site_page'

class TopicPage < SitePage
  attr_accessor :topic_page

  def initialize(topic_page)
    @topic_page = topic_page
  end

  def path
    @topic_page
  end

end
