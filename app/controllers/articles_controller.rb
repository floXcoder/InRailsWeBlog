class ArticlesController < ApplicationController
  # before_filter :authenticate_user!, except: [:index]
  # after_action :verify_authorized, except: [:index, :check_id]

  respond_to :html, :js, :json

  def index
    articles = []

    if params[:tag_ids]
      tag_ids = params[:tag_ids]
      articles = Article.with_translations(I18n.locale).joins(:tags).includes(:author, :tags).where(tags: { id: tag_ids }).order('articles.id DESC')
    else
      articles = Article.with_translations(I18n.locale).joins(:tags).includes(:author, :tags).all.order('articles.id DESC')
    end

    tags = Tag.joins(:articles).where(articles: {id: articles.ids}).order('name ASC').pluck(:id, :name).uniq

    if params[:page]
      articles = articles.paginate(page: params[:page], per_page: 5)
    end

    respond_to do |format|
      # format.html { render :index, locals: {articles: articles} }
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
    # article = current_user.articles.build(article_params)
    # authorize article

    article = User.first.articles.build(article_params)
    tags = article.tags.pluck(:id, :name).uniq

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
