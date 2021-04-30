# frozen_string_literal: true

module Tags
  class SearchService < Searches::BaseSearchService
    # Tag Search
    # +query+ parameter: string to query
    # +options+ parameter:
    #  current_user_id (current user id)
    #  page (page number for pagination)
    #  per_page (number of tags per page for pagination)
    #  exact (exact search or include misspellings, default: 2)
    #  operator (array of tags associated with tags, default: AND)
    #  highlight (highlight content, default: true)
    #  exact (do not misspelling, default: false, 1 character)
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = Tag
      @params[:format] = @params[:format] || 'sample'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.presence || '*'

      # Fields with boost
      fields = %w[name^10 description]

      # Search for entire word if exact
      word_match = @params[:exact] ? :word : :word_middle
      # Search for exact word if exact otherwise authorize 2 misspelling characters
      misspellings_distance = @params[:exact] ? 1 : 2
      # Search again if two few results using misspelling this time
      misspellings_retry = @params[:exact] ? 0 : 3

      # Operator type: 'and' or 'or'
      operator = @params[:operator] || 'and'

      # Highlight results and select a fragment
      highlight = false

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Aggregations
      aggregations = nil

      # Boost user tags first
      # boost_where = @params[:boost_where]

      # Page parameters
      page     = @params[:page] || 1
      per_page = @params[:per_page] || InRailsWeBlog.config.search_per_page

      # Order search
      order = order_search(@params[:order])

      # Includes to add when retrieving data from DB
      includes = if @params[:format] == 'strict'
                   [:user]
                 elsif @params[:format] == 'complete'
                   [:user]
                 else
                   []
                 end

      begin
        results = Tag.search(query_string,
                             fields:       fields,
                             highlight:    highlight,
                             match:        word_match,
                             misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                             suggest:      true,
                             page:         page,
                             per_page:     per_page,
                             operator:     operator,
                             where:        where_options,
                             boost_where:  @params[:boost_where],
                             order:        order,
                             aggs:         aggregations,
                             includes:     includes,
                             execute:      !@params[:defer])

        track_results(results)

        if @params[:defer]
          success(results)
        else
          success(parsed_search(results))
        end
      rescue StandardError => error
        error(I18n.t('search.errors.tag'), error)
      end
    end
  end
end
