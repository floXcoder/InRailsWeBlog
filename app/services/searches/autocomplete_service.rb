# frozen_string_literal: true

module Searches
  class AutocompleteService < Searches::BaseSearchService
    def initialize(query, *args)
      super(query, *args)
    end

    def perform
      articles_autocomplete = tags_autocomplete = topics_autocomplete = nil
      autocomplete_results  = {}

      where_options = {
        languages: @params[:language],
        user_id:   @params[:global] ? nil : @params[:user_id]
      }.compact
      visibility    = if @current_user
                        { _or: [{ visibility: 'only_me', user_id: @current_user.id }, { visibility: 'everyone' }] }
                      elsif @current_admin
                        { visibility: @params[:visibility] }
                      else
                        { visibility: 'everyone' }
                      end
      where_options.merge!(visibility)

      if search_type('article', @params[:selected_types])
        articles_autocomplete = Articles::AutocompleteService.new(
          @query,
          defer:       true,
          format:      'strict',
          highlight:   @current_user ? @current_user.search_highlight : true,
          limit:       @params[:limit] || InRailsWeBlog.config.per_page,
          no_fragment: @params[:no_fragment],
          where:       where_options.merge(
            mode:      @params[:mode],
            draft:     @params[:draft],
            tag_ids:   @params[:tag_ids].presence,
            topic_ids: @params[:topic_ids].presence
          ).compact,
          boost_where: { topic_id: @params[:topic_id] }
        )
      end

      if search_type('tag', @params[:selected_types])
        tags_autocomplete = Tags::AutocompleteService.new(
          @query,
          defer:       true,
          format:      'strict',
          limit:       @params[:limit] || InRailsWeBlog.config.per_page,
          where:       where_options.merge(
            topic_ids:  @params[:topic_ids].presence,
            parent_ids: @params[:tag_ids].presence
          ).compact,
          boost_where: { topic_ids: [@params[:topic_id]] }.compact
        )
      end

      if search_type('topic', @params[:selected_types])
        topics_autocomplete = Topics::AutocompleteService.new(
          @query,
          defer:  true,
          format: 'strict',
          limit:  @params[:limit] || InRailsWeBlog.config.per_page,
          where:  where_options
        )
      end

      begin
        searches = Searchkick.multi_search([articles_autocomplete&.perform&.result, tags_autocomplete&.perform&.result, topics_autocomplete&.perform&.result].compact)

        searches&.map do |search|
          case search.model_name.human
          when 'Article'
            article_results = articles_autocomplete&.format_search(search.results)
            next if article_results[:articles].empty?

            autocomplete_results[:articles] = article_results[:articles]
          when 'Tag'
            tag_results = tags_autocomplete&.format_search(search.results)
            next if tag_results[:tags].empty?

            autocomplete_results[:tags] = tag_results[:tags]
          when 'Topic'
            topic_results = topics_autocomplete&.format_search(search.results)
            next if topic_results[:topics].empty?

            autocomplete_results[:topics] = topic_results[:topics]
          end
        end

        if searches
          success(autocomplete_results)
        else
          error(I18n.t('search.errors.autocomplete'))
        end
      rescue StandardError => error
        error(I18n.t('search.errors.autocomplete'), error)
      end
    end
  end
end
