class SearchController < ApplicationController

  respond_to :json

  def index
    search_results = {}
    suggestions    = {}
    aggregations   = {}
    total_count    = {}
    total_pages    = {}

    search_options = {}

    # params[:search_options] = {} if !search_params[:search_options] || search_params[:search_options].is_a?(String)
    # if current_user && (user_settings = User.find(current_user.id))
    #   search_options[:highlight] = user_settings.settings[:search_highlight]
    #   search_options[:exact]     = user_settings.settings[:search_exact]
    #   search_options[:operator]  = user_settings.settings[:search_operator]
    # end
    # unless search_params[:search_options].empty?
    #   search_options[:highlight] = !(search_params[:search_options][:search_highlight] == 'false')
    #   search_options[:exact]     = !(search_params[:search_options][:search_exact] == 'false')
    #   search_options[:operator]  = search_params[:search_options][:search_operator]
    # end

    if search_type('article', search_params[:type])
      article_results = Article.search_for(search_params[:query],
                                           {
                                             page:             search_params[:ride_page] || search_params[:page],
                                             per_page:         search_params[:ride_per_page] || search_params[:per_page] || CONFIG.per_page,
                                             current_user_id:  current_user&.id,
                                             current_topic_id: current_user&.current_topic_id,
                                             where:            {
                                               notation:   search_params[:notation],
                                               accepted:   search_params[:accepted],
                                               home_page:  search_params[:home_page],
                                               visibility: !current_admin ? 'everyone' : search_params[:visibility],
                                               tags:       search_params[:tags] ? search_params[:tags].first.split(',') : nil
                                             },
                                             order:            search_params[:order]
                                           })

      unless article_results.empty?
        search_results.merge!(Article.as_json(article_results[:articles], sample: !search_params[:complete], current_user: current_user))
      end

      suggestions[:articles]  = article_results[:suggestions]
      aggregations[:articles] = article_results[:aggregations]
      total_count[:articles]  = article_results[:total_count]
      total_pages[:articles]  = article_results[:total_pages]
    end

    if search_type('tag', search_params[:type])
      tag_results = Tag.search_for(search_params[:query],
                                   {
                                     page:             search_params[:ride_page] || search_params[:page],
                                     per_page:         search_params[:ride_per_page] || search_params[:per_page] || CONFIG.per_page,
                                     current_user_id:  current_user&.id,
                                     current_topic_id: current_user&.current_topic_id,
                                     where:            {
                                       notation:   search_params[:notation],
                                       accepted:   search_params[:accepted],
                                       home_page:  search_params[:home_page],
                                       visibility: !current_admin ? 'everyone' : search_params[:visibility]
                                     },
                                     order:            search_params[:order]
                                   })

      unless tag_results.empty?
        search_results.merge!(Tag.as_json(tag_results[:tags], sample: !search_params[:complete], current_user: current_user))
      end

      suggestions[:tags]  = tag_results[:suggestions]
      aggregations[:tags] = tag_results[:aggregations]
      total_count[:tags]  = tag_results[:total_count]
      total_pages[:tags]  = tag_results[:total_pages]
    end

    search_results[:query]        = search_params[:query]
    search_results[:suggestions]  = suggestions
    search_results[:aggregations] = aggregations
    search_results[:total_count]  = total_count
    search_results[:total_pages]  = total_pages

    respond_to do |format|
      format.json { render json: search_results }
    end
  end

  def autocomplete
    autocomplete_results = {}

    if search_type('article', search_params[:type])
      autocomplete_articles           = Article.search(search_params[:query], {
        limit: search_params[:limit] || CONFIG.per_page,
        where: {
          visibility: !current_admin ? 'everyone' : nil
        }
      })

      autocomplete_results[:articles] = autocomplete_articles unless autocomplete_articles.empty?
    end

    if search_type('tag', search_params[:type])
      autocomplete_tags           = Tag.search(search_params[:query], {
        limit: search_params[:limit] || CONFIG.per_page,
        where: {
          visibility: !current_admin ? 'everyone' : nil
        }
      })

      autocomplete_results[:tags] = autocomplete_tags unless autocomplete_tags.empty?
    end

    respond_to do |format|
      format.json { render json: autocomplete_results }
    end
  end

  private

  def search_params
    if params[:search] && !params[:search].empty?
      params.require(:search).permit(:complete,
                                     :type,
                                     :per_page,
                                     :article_per_page,
                                     :tag_per_page,
                                     :page,
                                     :article_page,
                                     :tag_page,
                                     :limit,
                                     :query,
                                     :rating,
                                     :notation,
                                     :visibility,
                                     :accepted,
                                     :home_page,
                                     :order,
                                     type:  [],
                                     types: [],
                                     tags:  [],
                                     order: []
      ).reject { |_, v| v.blank? }
    else
      {}
    end
  end

  def search_type(type, current_type)
    return true unless current_type

    if current_type.is_a? Array
      return current_type.map(&:downcase).include?(type.downcase)
    else
      if type.casecmp(current_type) == 0
        return true
      else
        return !%w(article tag).include?(current_type.downcase)
      end
    end
  end
end
