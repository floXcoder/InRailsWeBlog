# frozen_string_literal: true

module Articles
  class SearchService < Searches::BaseSearchService
    # Article Search
    # +query+ parameter: string to query
    # +params+ parameter:
    #  page (page number for pagination)
    #  per_page (number of articles per page for pagination)
    #  exact (exact search or include misspellings, default: 2)
    #  tags (array of tag ids associated with articles)
    #  operator (array of tags associated with articles, default: AND)
    #  highlight (highlight content, default: true)
    #  exact (do not misspelling, default: false, 1 character)
    def initialize(query, *args)
      super(query, *args)

      @params[:model]  = Article
      @params[:format] = @params[:format] || 'sample'
    end

    def perform
      # If query not defined or blank, search for everything
      query_string = @query.presence || '*'

      # Fields with boost
      fields = if @params[:current_topic]&.inventories?
                 %w[title^10 summary^5 content].concat(@params[:current_topic].inventory_fields.select(&:searchable).map(&:field_name))
               else
                 %w[title^10 summary^5 content]
               end

      # Search for entire word if exact
      word_match = @params[:exact] ? :word : :word_middle
      # Search for exact word if exact otherwise authorize 2 misspelling characters
      misspellings_distance = @params[:exact] ? 0 : 2
      # Search again if two few results (3) using misspelling this time
      misspellings_retry = @params[:exact] ? 0 : 3

      # Operator type: 'and' or 'or'
      operator = @params[:operator] || 'and'

      # Highlight results and select a fragment
      # highlight = @params[:highlight] ? { tag: '<span class="search-highlight">', fragment_size: InRailsWeBlog.config.search_fragment_size } : false
      highlight = @params[:highlight] ? { tag: '<span class="search-highlight">' } : false

      # Where options only for ElasticSearch
      where_options = where_search(@params[:where])

      # Boost user articles first
      boost_where = @params[:boost_where]

      # Page parameters
      page     = @params[:page] || 1
      per_page = @params[:per_page] || InRailsWeBlog.config.search_per_page

      # Order search
      order = order_search(@params[:order] || 'priority_desc')

      # Aggregations
      aggregations = if @params[:format] != 'strict' && @params[:current_topic]
                       Hash[@params[:current_topic].inventory_fields.select(&:filterable).map { |field| [field.field_name, {}] }]
                     end

      # Includes to add when retrieving data from DB
      includes = if @params[:format] == 'strict'
                   [:tags, user: [:picture]]
                 elsif @params[:format] == 'complete'
                   [:topic, :tags, user: [:picture]]
                 else
                   [:topic, :tags, user: [:picture]]
                 end

      begin
        results = Article.search(query_string,
                                 fields:       fields,
                                 highlight:    highlight,
                                 match:        word_match,
                                 misspellings: { below: misspellings_retry, edit_distance: misspellings_distance },
                                 suggest:      true,
                                 page:         page,
                                 per_page:     per_page,
                                 operator:     operator,
                                 where:        where_options,
                                 boost_where:  boost_where,
                                 order:        order,
                                 aggs:         aggregations,
                                 includes:     includes,
                                 # index_name:    %w[articles-fr articles-en],
                                 # indices_boost: { "articles-#{I18n.locale}" => 5 },
                                 execute: !@params[:defer])

        track_results(results)

        if @params[:defer]
          success(results)
        else
          success(parsed_search(results))
        end
      rescue StandardError => error
        track_error(error)

        error(I18n.t('search.errors.article'), error)
      end
    end
  end
end
