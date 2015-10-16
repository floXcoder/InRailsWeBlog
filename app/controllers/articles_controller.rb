class ArticlesController < ApplicationController
  # before_filter :authenticate_user!, except: [:index]
  # after_action :verify_authorized, except: [:index, :check_id]

  respond_to :html, :js, :json

  include ActionView::Helpers::SanitizeHelper

  def index
    articles = []
    current_user_id = current_user ? current_user.id : nil

    if params[:tags]
      tag_ids = params[:tags]
      articles = Article.user_related(current_user_id).joins(:tags).where(tags: {id: tag_ids}).order('articles.id DESC')
    else
      articles = Article.user_related(current_user_id).all.order('articles.id DESC')
    end

    tags = Tag.joins(:articles).where(articles: {id: articles.ids}).order('name ASC').pluck(:id, :name).uniq

    articles = articles.paginate(page: params[:page], per_page: 5) if params[:page]

    respond_to do |format|
      format.html { render :articles, formats: :json, locals: {articles: articles, tags: tags} }
      format.json { render :articles, locals: {articles: articles, tags: tags} }
    end
  end

  def show
    article = Article.friendly.find(params[:id])
    authorize article

    render :show, locals: {article: article}
  end

  def create
    article = current_user.articles.build(article_params)
    # authorize article

    tags = article.tags.pluck(:id, :name).uniq

    # Sanitize HTML content
    content = article_params[:content]
    content = content.sub(/^<p><br><\/p>/, '')
    content = sanitize(content, tags: %w(h1 h2 h3 h4 h5 h6 blockquote p a ul ol nl li b i strong em strike code hr br table thead caption tbody tr th td pre img), attributes: %w(href name target src alt center align))
    article.content = content

    respond_to do |format|
      if article.save
        # format.html do
        #     redirect_to article, flash: {success: t('views.article.flash.successful_creation')}
        # end
        # format.js { js_redirect_to(article_path(article) || root_path, :success, t('views.article.flash.successful_creation')) }
        format.json { render :articles, locals: {articles: [article], tags: tags}, status: :created, location: article }
      else
        # format.html { render :new, locals: {article: article} }
        # format.js { render :create }
        format.json { render json: article.errors, status: :unprocessable_entity }
      end
    end
  end

  def search
    search_options = {}
    user_preferences = nil

    w params

    user_preferences = User.find(current_user.id) if current_user
    params[:search_options] = {} unless params[:search_options]

    if params[:search_options].is_a?(Hash) || user_preferences
      if (highlight = params[:search_options][:search_highlight])
        search_options[:highlight] = (highlight == 'false' ? false : true)
      else
        search_options[:highlight] = (user_preferences.read_preference(:search_highlight) == 'false' ? false : true)
      end
      search_options[:operator] = params[:search_options][:search_operator] || user_preferences.read_preference(:search_operator)
      if (exact = params[:search_options][:search_exact])
        search_options[:exact] = (exact == 'false' ? false : true)
      else
        search_options[:exact] = (user_preferences.read_preference(:search_exact) == 'false' ? false : true)
      end
    end

    articles = Article.search_for(params[:query],
                                  {
                                      page: params[:page],
                                      per_page: 5,
                                      current_user_id: current_user ? current_user.id : nil,
                                      tags: params[:tags],
                                      highlight: search_options[:highlight],
                                      operator: search_options[:operator],
                                      exact: search_options[:exact]
                                  })

    suggestions = articles.suggestions

    tags = Tag.joins(:articles).where(articles: {id: articles.results.map(&:id)}).order('name ASC').pluck(:id, :name).uniq

    respond_to do |format|
      format.html { render :articles, formats: :json, locals: {articles: articles.with_details, tags: tags, suggestions: suggestions} }
      format.json { render :articles, locals: {articles: articles.with_details, tags: tags, suggestions: suggestions} }
    end
  end

  def autocomplete
    results = Article.user_related(current_user).search(params[:autocompleteQuery], autocomplete: true, limit: 6)

    results = results.map { |result|
      {
          title: result.title,
          tags: result.tags.pluck(:name)
      }
    }

    respond_to do |format|
      format.json { render json: results }
      format.html { render json: results }
    end
  end

  def edit
    # user = User.friendly.find(params[:id])
    # authorize user
    #
    # render :edit, locals: { user: user }
  end

  def update
    # user = User.friendly.find(params[:id])
    # authorize user
    #
    # if user.update_without_password(user_params)
    #   flash[:success] = t('views.user.flash.successful_update')
    #   redirect_to root_user_path(user)
    # else
    #   flash[:error] = t('views.user.flash.error_update')
    #   render :edit, locals: { user: user }
    # end
  end

  def destroy
    # article = article.find(params[:id])
    # authorize article
    #
    # article.remove
    #
    # redirect_to root_user_path(current_user), flash: {success: t('views.article.flash.successful_deletion')}
  end

  private

  def article_params
    params.require(:articles).permit(:title,
                                     :summary,
                                     :content,
                                     :visibility,
                                     :notation,
                                     :priority,
                                     :allow_comment)
  end
end
