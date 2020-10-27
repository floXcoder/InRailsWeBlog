# frozen_string_literal: true

module Articles
  class AutocompleteService < Searches::BaseSearchService
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = Article
      @params[:format] = @params[:format] || 'strict'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.presence

      # Fields with boost
      fields = @params[:title_only] ? %w[title] : %w[title^10 summary content]

      # Highlight results and select a fragment
      highlight = @params[:highlight] ? { tag: '<span class="search-highlight">', fragment_size: (@params[:no_fragment] ? nil : InRailsWeBlog.config.autocomplete_fragment_size ) } : false

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Order search
      order = order_search(@params[:order])

      # Set result limit
      limit = @params[:limit] || InRailsWeBlog.config.per_page

      begin
        results = Article.search(query_string,
                                 fields:       fields,
                                 match:        :word_middle,
                                 misspellings: { below: 2, edit_distance: 2 },
                                 highlight:    highlight,
                                 load:         false,
                                 where:        where_options,
                                 # Boots too greedy, ignore other articles title in other topics
                                 # boost_where:  @params[:boost_where],
                                 order:        order,
                                 limit:        limit,
                                 execute:      !@params[:defer])

        track_results(results)

        if @params[:defer]
          success(results)
        else
          success(format_search(results))
        end
      rescue StandardError => error
        error(I18n.t('search.errors.article'), error)
      end
    end
  end
end
