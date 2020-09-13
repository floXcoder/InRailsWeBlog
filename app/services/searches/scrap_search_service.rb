# frozen_string_literal: true

require 'open-uri'

module Searches
  class ScrapSearchService < Searches::BaseSearchService
    def initialize(query, article_ids, *args)
      super(query, *args)

      @article_ids = article_ids.is_a?(Array) ? article_ids : article_ids.to_s.split(',')
    end

    def perform
      return success({}) if @query.blank?

      results = []
      threads = []

      begin
        articles = Article.where(id: @article_ids)
        articles.each do |article|
          links = parse_article_links(article)
          links.each do |link|
            threads << Thread.new do
              results << [article.id, link, static_search(link, @query)]
            end
          end
        end

        threads.each(&:join)

        articles_results = {}
        results.map do |r|
          article_id, link, extract = r

          next unless extract.present?

          articles_results[article_id] ||= [link]
          articles_results[article_id] << extract
        end

        success(articles_results)
      rescue StandardError => error
        error(I18n.t('search.errors.scrap'), error)
      end
    end

    private

    def parse_article_links(article)
      links = []

      urls = article.content.scan(/<a (.*?)href="(https*:\/\/.*?)"(.*?)>/)
      urls.each do |url|
        _part_1, link, _part_2 = url
        links << link
      end

      return links
    end

    # Parse only HTML content of the page
    def static_search(url, query)
      response = Faraday::Connection.new.get(url) do |request|
        request.headers         = {
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36" }
        request.options.timeout = 5
      end

      status = response.status.to_i
      return nil unless status < 300

      formatted_content = ActionController::Base.helpers.strip_tags(response.body)
      formatted_content = formatted_content.squish.strip

      return formatted_content.scan(/.{#{InRailsWeBlog.config.scrap_fragment_size}}\b#{query}\b.{#{InRailsWeBlog.config.scrap_fragment_size}}/i)
    rescue StandardError
      return nil
    end

    # Parse page with JS executed
    def dynamic_search
      # require 'selenium-webdriver'
      #
      # options = Selenium::WebDriver::Chrome::Options.new(args: ['headless'])
      # driver = Selenium::WebDriver.for(:chrome, options: options)
      # driver.get('http://stackoverflow.com/')
      # puts driver.title
      # driver.quit
    end

  end
end
