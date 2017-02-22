class SearchController < ApplicationController
  respond_to :json

  def index
    search_results = {}
    suggestions    = {}
    total_count    = {}
    total_pages    = {}

    search_options          = {}

    params[:search_options] = {} if !search_params[:search_options] || search_params[:search_options].is_a?(String)

    if current_user && (user_preferences = User.find(current_user.id))
      search_options[:highlight] = user_preferences.preferences[:search_highlight]
      search_options[:exact]     = user_preferences.preferences[:search_exact]
      search_options[:operator]  = user_preferences.preferences[:search_operator]
    end

    unless search_params[:search_options].empty?
      search_options[:highlight] = !(search_params[:search_options][:search_highlight] == 'false')
      search_options[:exact]     = !(search_params[:search_options][:search_exact] == 'false')
      search_options[:operator]  = search_params[:search_options][:search_operator]
    end
    article_results = Article.search_for(search_params[:query],
                                 {
                                   page:            search_params[:page],
                                   per_page:        5,
                                   current_user_id: current_user_id,
                                   tags:            search_params[:tags],
                                   highlight:       search_options[:highlight],
                                   operator:        search_options[:operator],
                                   exact:           search_options[:exact]
                                 })

    unless articles.empty?
      articles = article_results[:articles].includes(:author, :tags)
      articles = articles.user_related(current_user&.id)
      search_results.merge!(ActiveModel::SerializableResource.new(articles,
                                                                  { highlight:       article_results[:highlight],
                                                                    each_serializer: ArticleSerializer }).serializable_hash)
      suggestions[:articles] = article_results[:suggestions]
      total_count[:articles] = article_results[:total_count]
      total_pages[:articles] = article_results[:total_pages]
    end

    search_results[:query]       = search_params[:query]
    search_results[:suggestions] = suggestions
    search_results[:total_count] = total_count
    search_results[:total_pages] = total_pages

    respond_to do |format|
      format.json { render json: search_results }
    end
  end

  def autocomplete
    autocomplete_results = {}

    if search_type('article', search_params[:type])
      autocomplete_articles = Article.search(params[:autocompleteQuery], autocomplete: true, limit: 6)
                  .records
                  .includes(:tags)
                  .user_related(current_user&.id)

      autocomplete_results.merge!(ActiveModelSerializers::SerializableResource.new(autocomplete_articles, each_serializer: ArticleSampleSerializer, strict: true).serializable_hash) unless autocomplete_articles.empty?
    end

    respond_to do |format|
      format.json { render json: autocomplete_results }
    end
  end

  private
  def search_params
    params.require(:search).permit(:type,
                                   :page,
                                   :query,
                                   :rating,
                                   :notation,
                                   :search_options,
                                   :tags
    ).reject { |_, v| v.blank? }
  end

  def search_type(type, current_type)
    return true unless current_type

    if type.casecmp(current_type) == 0
      return true
    else
      return !%w(article tag).include?(current_type.downcase)
    end
  end

end
