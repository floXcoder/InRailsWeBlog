# frozen_string_literal: true

module Articles
  class SearchService < Searches::BaseSearchService
    # Article Search
    # +query+ parameter: string to query
    # +params+ parameter:
    #  current_user_id (current user id)
    #  current_topic_id (current topic id for current user)
    #  page (page number for pagination)
    #  per_page (number of articles per page for pagination)
    #  exact (exact search or include misspellings, default: 2)
    #  tags (array of tag ids associated with articles)
    #  operator (array of tags associated with articles, default: AND)
    #  highlight (highlight content, default: true)
    #  exact (do not misspelling, default: false, 1 character)
    def initialize(query, *args)
      super(query, *args)

      @params[:model] = Article
      @params[:format] = @params[:format] || 'sample'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.blank? ? '*' : @query

      # Fields with boost
      fields = %w[title^10 summary^5 content]

      # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
      misspellings_distance = @params[:exact] || query_string.length < 7 ? 0 : 2
      misspellings_retry    = 3

      # Operator type: 'and' or 'or'
      operator = @params[:operator] || 'and'

      # Highlight results and select a fragment
      # highlight = @params[:highlight] ? { fields: { content: { fragment_size: 10 } }, tag: '<span class="search-highlight">' } : false
      highlight = @params[:highlight] ? { tag: '<span class="search-highlight">' } : false

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Aggregations
      aggregations  = {
        notation: { where: { notation: { not: 0 } } },
        mode:     {},
        tags:     {}
      } if @params[:format] != 'strict'

      # Boost user articles first
      boost_where            = {}
      boost_where[:user_id]  = @params[:current_user_id] if @params[:current_user_id]
      boost_where[:topic_id] = @params[:current_topic_id] if @params[:current_topic_id]

      # Page parameters
      page     = @params[:page] || 1
      per_page = @params[:per_page] || Setting.search_per_page

      # Order search
      order = order_search(@params[:order] || 'priority_desc')

      # Includes to add when retrieving data from DB
      includes = if @params[:format] == 'strict'
                   [:tags, user: [:picture]]
                 elsif @params[:format] == 'complete'
                   [:tags, user: [:picture]]
                 else
                   [:tags, user: [:picture]]
                 end

      begin
        results = Article.search(query_string,
                                 fields:       fields,
                                 highlight:    highlight,
                                 boost_where:  boost_where,
                                 match:        :word_middle,
                                 misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                                 suggest:      true,
                                 page:         page,
                                 per_page:     per_page,
                                 operator:     operator,
                                 where:        where_options,
                                 order:        order,
                                 aggs:         aggregations,
                                 includes:     includes,
                                 # index_name:    %w[articles-fr articles-en],
                                 # indices_boost: { "articles-#{I18n.locale}" => 5 },
                                 execute: !@params[:defer])

        if @params[:defer]
          success(results)
        else
          success(parsed_search(results))
        end
      rescue StandardError => error
        error(error)
      end
    end
  end
end
