# frozen_string_literal: true

module Users
  class SearchService < Searches::BaseSearchService
    # User Search
    # +query+ parameter: string to query
    # +options+ parameter:
    #  current_user_id (current user id)
    #  current_topic_id (current topic id for current user)
    #  page (page number for pagination)
    #  per_page (number of users per page for pagination)
    #  exact (exact search or include misspellings, default: 2)
    #  tags (array of tags associated with users)
    #  operator (array of tags associated with users, default: AND)
    #  highlight (highlight content, default: true)
    #  exact (do not misspelling, default: false, 1 character)
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = User
      @params[:format] = @params[:format] || 'sample'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.presence || '*'

      # Fields with boost
      fields = %w[pseudo]

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

      # Include tag in search, all tags: options[:tags] ; at least one tag: {all: options[:tags]}
      where_options = where_search(@params[:where])

      # Boost user users first
      boost_where = nil

      # Page parameters
      page     = @params[:page] || 1
      per_page = @params[:per_page] || InRailsWeBlog.config.search_per_page

      # Order search
      order = order_search(@params[:order])

      begin
        results = User.search(query_string,
                              fields:       fields,
                              boost_where:  boost_where,
                              highlight:    highlight,
                              match:        word_match,
                              misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                              suggest:      true,
                              page:         page,
                              per_page:     per_page,
                              operator:     operator,
                              where:        where_options,
                              order:        order)

        track_results(results)

        if @params[:defer]
          success(results)
        else
          success(parsed_search(results))
        end
      rescue StandardError => error
        track_error(error)

        error(I18n.t('search.errors.user'), error)
      end
    end
  end
end
