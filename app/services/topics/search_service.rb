# frozen_string_literal: true

module Topics
  class SearchService < Searches::BaseSearchService
    # Topic Search
    # +query+ parameter: string to query
    # +options+ parameter:
    #  current_user_id (current user id)
    #  current_topic_id (current topic id for current user)
    #  page (page number for pagination)
    #  per_page (number of topics per page for pagination)
    #  exact (exact search or include misspellings, default: 2)
    #  tags (array of tags associated with topics)
    #  operator (array of tags associated with topics, default: AND)
    #  highlight (highlight content, default: true)
    #  exact (do not misspelling, default: false, 1 character)
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = Topic
      @params[:format] = @params[:format] || 'sample'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.blank? ? '*' : @query

      # Fields with boost
      fields = %w[name^10 description]

      # Misspelling: use exact search if query has less than 7 characters and perform another using misspellings search if less than 3 results
      misspellings_distance = @params[:exact] || query_string.length < 7 ? 0 : 2
      misspellings_retry    = 3

      # Operator type: 'and' or 'or'
      operator = @params[:operator] || 'and'

      # Highlight results and select a fragment
      highlight = false

      # Where options only for ElasticSearch
      where_options = nil

      # # Aggregations
      aggregations = nil

      # Boost user topics first
      boost_where = nil

      # Page parameters
      page     = @params[:page] || 1
      per_page = @params[:per_page] || Setting.search_per_page

      # Order search
      order = order_search(@params[:order])

      # Includes to add when retrieving data from DB
      includes = if @params[:format] == 'strict'
                   [:user]
                 elsif @params[:format] == 'complete'
                   [:user]
                 else
                   [:user]
                 end

      begin
        results = Topic.search(query_string,
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
                               execute:      !@params[:defer])

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
