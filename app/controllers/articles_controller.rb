class ArticlesController < ApplicationController
  # before_filter :authenticate_user!, except: [:index]
  # after_action :verify_authorized, except: [:index, :check_id]

  respond_to :html, :js, :json

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
      format.html { render :articles, formats: :json,
                           locals: {
                               articles: articles,
                               tags: tags,
                               current_user_id: current_user_id
                           }
      }
      format.json { render :articles,
                           locals: {
                               articles: articles,
                               tags: tags,
                               current_user_id: current_user_id
                           }
      }
    end
  end

  def show
  end

  def create
    if current_user.read_preference(:multi_language) == 'true'
      article = current_user.articles.build(article_translated_params)
    else
      article = current_user.articles.build(article_params)
    end

    current_user_id = current_user ? current_user.id : nil

    tags = article.tags.pluck(:id, :name).uniq

    respond_to do |format|
      if article.save
        format.json { render :articles, locals: {articles: [article], tags: tags, current_user_id: current_user_id}, status: :created, location: article }

        # Save tag relationship
        article.parent_tags.each do |parent|
          article.child_tags.each do |child|
            unless parent.children.exists?(child)
              parent.children << child
            end
          end
        end unless article.child_tags.empty?
      else
        format.json { render json: article.errors, status: :unprocessable_entity }
      end
    end
  end

  def search
    search_options = {}

    params[:search_options] = {} if !params[:search_options] || params[:search_options].is_a?(String)

    if current_user && (user_preferences = User.find(current_user.id))
      search_options[:highlight] = (user_preferences.read_preference(:search_highlight) == 'false' ? false : true)
      search_options[:exact] = (user_preferences.read_preference(:search_exact) == 'false' ? false : true)
      search_options[:operator] = user_preferences.read_preference(:search_operator)
    end

    unless params[:search_options].empty?
      search_options[:highlight] = (params[:search_options][:search_highlight] == 'false' ? false : true)
      search_options[:exact] = (params[:search_options][:search_exact] == 'false' ? false : true)
      search_options[:operator] = params[:search_options][:search_operator]
    end

    current_user_id = current_user ? current_user.id : nil

    results = Article.search_for(params[:query],
                                 {
                                     page: params[:page],
                                     per_page: 5,
                                     current_user_id: current_user_id,
                                     tags: params[:tags],
                                     highlight: search_options[:highlight],
                                     operator: search_options[:operator],
                                     exact: search_options[:exact]
                                 })

    articles = results[:articles].includes(:author).user_related(current_user_id)

    tags = articles.joins(:tags).order('name ASC').pluck('tags.id', 'tags.name').uniq

    respond_to do |format|
      format.html {
        render :articles, formats: :json,
               locals: {
                   articles: articles,
                   tags: tags,
                   highlight: results[:highlight],
                   current_user_id: current_user_id,
                   suggestions: results[:suggestions]}
      }
      format.json {
        render :articles,
               locals: {
                   articles: articles,
                   tags: tags,
                   highlight: results[:highlight],
                   current_user_id: current_user_id,
                   suggestions: results[:suggestions]}
      }
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
  end

  def update
    article = Article.find(params[:id])
    # authorize article

    current_user_id = current_user ? current_user.id : nil

    respond_to do |format|
      if article.update_attributes(article_params)
        format.json { render :articles, locals: {articles: [article], current_user_id: current_user_id}, status: :accepted, location: article }
      else
        format.json { render json: article.errors, status: :not_modified }
      end
    end
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
                                     :allow_comment,
                                     tags_attributes: [:id, :name, :parent, :child])
  end

  def article_translated_params
    params.require(:articles).permit(:visibility,
                                     :notation,
                                     :priority,
                                     :allow_comment,
                                     translations_attributes: [:locale, :title, :summary, :content],
                                     tags_attributes: [:id, :name, :parent, :child])
  end
end
