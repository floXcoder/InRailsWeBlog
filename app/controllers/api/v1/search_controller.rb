module Api::V1
  class SearchController < ApplicationController
    before_action :verify_requested_format!
    before_action :honeypot_protection, only: [:index, :autocomplete]

    respond_to :json

    def index
      article_search = tag_search = topic_search = nil
      search_results = {
        suggestions:  {},
        aggregations: {},
        totalCount:   {},
        totalPages:   {}
      }

      results_format = search_params[:complete] ? 'complete' : 'sample'
      visibility     = if current_user
                         { _or: [{ visibility: 'only_me', user_id: current_user.id }, { visibility: 'everyone' }] }
                       elsif !current_admin
                         { visibility: 'everyone' }
                       else
                         { visibility: search_params[:visibility] }
                       end

      if search_type('article', search_params[:selected_types])
        article_search = Article.search_for(
          search_params[:query],
          defer:            true,
          format:           results_format,
          page:             search_params[:article_page] || search_params[:page],
          per_page:         search_params[:article_per_page] || search_params[:per_page] || Setting.search_per_page,
          current_user_id:  current_user&.id,
          current_topic_id: current_user&.current_topic_id,
          highlight:        current_user ? current_user.search_highlight : true,
          exact:            current_user ? current_user.search_exact : nil,
          operator:         current_user ? current_user.search_operator : nil,
          order:            search_params[:order],
          where:            {
                              mode:      search_params[:mode],
                              draft:     search_params[:draft],
                              languages: search_params[:language],
                              notation:  search_params[:notation],
                              accepted:  search_params[:accepted],
                              home_page: search_params[:home_page],
                              tags:      search_params[:tags] ? search_params[:tags].first.split(',') : nil,
                              topics:    search_params[:topics] ? search_params[:topics].first.split(',') : nil
                            }.merge(visibility).compact
        )
      end

      if search_type('tag', search_params[:selected_types])
        tag_search = Tag.search_for(
          search_params[:query],
          defer:    true,
          format:   results_format,
          page:     search_params[:tag_page] || search_params[:page],
          per_page: search_params[:tag_per_page] || search_params[:per_page] || Setting.search_per_page,
          exact:    current_user ? current_user.search_exact : nil,
          operator: current_user ? current_user.search_operator : nil,
          order:    search_params[:order],
          where:    {
                      accepted:  search_params[:accepted],
                      home_page: search_params[:home_page]
                    }.merge(visibility).compact
        )
      end

      if search_type('topic', search_params[:selected_types])
        topic_search = Topic.search_for(
          search_params[:query],
          defer:    true,
          format:   results_format,
          page:     search_params[:topic_page] || search_params[:page],
          per_page: search_params[:topic_per_page] || search_params[:per_page] || Setting.search_per_page,
          exact:    current_user ? current_user.search_exact : nil,
          operator: current_user ? current_user.search_operator : nil,
          order:    search_params[:order],
          where:    {
                      accepted:  search_params[:accepted],
                      home_page: search_params[:home_page]
                    }.merge(visibility).compact
        )
      end

      searches = Searchkick.multi_search([article_search, tag_search, topic_search].compact)

      searches.map do |search|
        case search.model_name.human
          when 'Article'
            article_results = Article.parsed_search(search, results_format, current_user)

            next if article_results[:articles].empty?
            search_results.merge!(article_results[:articles])
            search_results[:suggestions][:articles]  = article_results[:suggestions]
            search_results[:aggregations][:articles] = article_results[:aggregations]
            search_results[:totalCount][:articles]   = article_results[:total_count]
            search_results[:totalPages][:articles]   = article_results[:total_pages]
          when 'Tag'
            tag_results = Tag.parsed_search(search, results_format, current_user)

            next if tag_results[:tags].empty?
            search_results.merge!(tag_results[:tags])
            search_results[:suggestions][:tags] = tag_results[:suggestions]
            search_results[:totalCount][:tags]  = tag_results[:total_count]
            search_results[:totalPages][:tags]  = tag_results[:total_pages]
          when 'Topic'
            topic_results = Topic.parsed_search(search, results_format, current_user)

            next if topic_results[:topics].empty?
            search_results.merge!(topic_results[:topics])
            search_results[:suggestions][:topics] = topic_results[:suggestions]
            search_results[:totalCount][:topics]  = topic_results[:total_count]
            search_results[:totalPages][:topics]  = topic_results[:total_pages]
        end
      end

      current_user&.create_activity(:search, params: { query: search_params[:query], count: search_results[:totalCount].values.reduce(:+) })

      respond_to do |format|
        format.json { render json: search_results }
      end
    end

    def autocomplete
      articles_autocomplete = tags_autocomplete = topics_autocomplete = nil
      autocomplete_results  = {}

      where_options = {
        languages: search_params[:language]
      }
      visibility    = if current_user
                        { _or: [{ visibility: 'only_me', user_id: current_user.id }, { visibility: 'everyone' }] }
                      elsif !current_admin
                        { visibility: 'everyone' }
                      end
      where_options.merge(visibility)

      if search_type('article', search_params[:selected_types])
        where_options.merge(
          mode:   search_params[:mode],
          draft:  search_params[:draft],
          tags:   search_params[:tags] ? search_params[:tags].first.split(',') : nil,
          topics: search_params[:topics] ? search_params[:topics].first.split(',') : nil
        )
        articles_autocomplete = Article.autocomplete_for(
          search_params[:query],
          defer:  true,
          format: 'strict',
          limit:  search_params[:limit] || Setting.per_page,
          where:  where_options
        )
      end

      if search_type('tag', search_params[:selected_types])
        tags_autocomplete = Tag.autocomplete_for(
          search_params[:query],
          defer:  true,
          format: 'strict',
          limit:  search_params[:limit] || Setting.per_page,
          where:  where_options
        )
      end

      if search_type('topic', search_params[:selected_types])
        topics_autocomplete = Topic.autocomplete_for(
          search_params[:query],
          defer:  true,
          format: 'strict',
          limit:  search_params[:limit] || Setting.per_page,
          where:  where_options
        )
      end

      searches = Searchkick.multi_search([articles_autocomplete, tags_autocomplete, topics_autocomplete].compact)

      searches.map do |search|
        case search.model_name.human
          when 'Article'
            article_results = Article.format_search(search.results, 'strict', current_user)
            next if article_results[:articles].empty?
            autocomplete_results[:articles] = article_results[:articles]
          when 'Tag'
            tag_results = Tag.format_search(search, 'strict', current_user)

            next if tag_results[:tags].empty?
            autocomplete_results[:tags] = tag_results[:tags]
          when 'Topic'
            topic_results = Topic.format_search(search, 'strict', current_user)

            next if topic_results[:topics].empty?
            autocomplete_results[:topics] = topic_results[:topics]
        end
      end

      respond_to do |format|
        format.json { render json: autocomplete_results }
      end
    end

    private

    def search_params
      if params[:search].present?
        params.require(:search).permit(:complete,
                                       :per_page,
                                       :article_per_page,
                                       :tag_per_page,
                                       :page,
                                       :article_page,
                                       :tag_page,
                                       :limit,
                                       :query,
                                       :rating,
                                       :mode,
                                       :draft,
                                       :language,
                                       :notation,
                                       :visibility,
                                       :accepted,
                                       :home_page,
                                       :order,
                                       :selected_types,
                                       selected_types: [],
                                       tags:           [],
                                       order:          []
        ).reject { |_, v| v.blank? }
      else
        {}
      end
    end

    def search_type(type, current_type, options = {})
      (return options[:strict] ? false : true) unless current_type

      if current_type.is_a?(Array)
        return current_type.map(&:downcase).include?(type.to_s.downcase)
      else
        if type.to_s.casecmp(current_type.to_s).zero?
          return true
        else
          return !%w[article tag topic].include?(current_type.to_s.downcase)
        end
      end
    end
  end
end
