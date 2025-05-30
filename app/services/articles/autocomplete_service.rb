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
      highlight = if @params[:highlight]
                    { tag: '<span class="search-highlight">', fragment_size: (@params[:no_fragment] ? nil : InRailsWeBlog.settings.autocomplete_fragment_size) }
                  else
                    false
                  end

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Order search
      order = order_search(@params[:order])

      # Set result limit
      limit = @params[:limit]&.to_i || InRailsWeBlog.settings.per_page

      begin
        results = Article.search(query_string,
                                 fields:       fields,
                                 match:        :word_middle,
                                 misspellings: { below: 2, edit_distance: @params[:boost_where].present? ? 1 : 2 },
                                 highlight:    highlight,
                                 load:         false,
                                 where:        where_options,
                                 boost_by:     @params[:boost_by],
                                 boost_where:  @params[:boost_where],
                                 order:        order,
                                 limit:        limit)

        track_results(results)

        if @params[:defer]
          success(results)
        else
          success(format_search(results.to_a))
        end
      rescue StandardError => error
        error(I18n.t('search.errors.article'), error)
      end
    end
  end
end
