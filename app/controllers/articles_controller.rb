class ArticlesController < ApplicationController
  before_filter :authenticate_user!, except: [:index, :search, :autocomplete, :show]
  after_action :verify_authorized, except: [:index, :search, :autocomplete]

  respond_to :html, :js, :json

  def index
    current_user_id = current_user ? current_user.id : nil

    articles = if params[:tags]
                 tag_names = params[:tags].map { |tag| tag.downcase }
                 Article.includes(:translations, :author)
                     .user_related(current_user_id)
                     .joins(:tags)
                     .where(tags: {name: tag_names})
                     .order('articles.id DESC')
               elsif params[:relation_tags]
                 parent_tag, child_tag = params[:relation_tags].map { |tag| tag.downcase }
                 parent_articles = Article
                                       .joins(:tags)
                                       .where(tagged_articles: {parent: true}, tags: {name: parent_tag})
                 children_articles = Article
                                         .joins(:tags)
                                         .where(tagged_articles: {child: true}, tags: {name: child_tag})
                 Article.includes(:translations, :author)
                     .user_related(current_user_id)
                     .joins(:tags)
                     .where(id: parent_articles.ids & children_articles.ids)
                     .order('articles.id DESC')
               elsif params[:mode] == 'bookmark'
                 Article.includes(:translations, :author, :tags)
                     .user_related(current_user_id)
                     .where(id: current_user.bookmarks.ids)
                     .order('articles.id DESC')
               elsif params[:mode] == 'temporary'
                 Article.includes(:translations, :author, :tags)
                     .user_related(current_user_id)
                     .where(temporary: true)
                     .order('articles.id DESC')
               else
                 Article.includes(:translations, :author, :tags)
                     .user_related(current_user_id)
                     .all
                     .order('articles.id DESC')
               end

    articles = articles.where(author_id: params[:user_id]) if params[:user_id]
    articles = articles.where(author_id: User.friendly.find(params[:user_pseudo].downcase)) if params[:user_pseudo]
    articles = articles.paginate(page: params[:page], per_page: CONFIG.per_page) if params[:page]
    articles = articles.uniq

    respond_to do |format|
      format.html { render json: articles, formats: :json, content_type: 'application/json' }
      format.json { render json: articles }
    end
  end

  def create
    article = current_user.articles.build

    if current_user.read_preference(:multi_language) == 'true'
      article.assign_attributes(article_translated_params)
    else
      article.assign_attributes(article_params)
    end
    authorize article

    respond_to do |format|
      if article.save
        article.build_tag_relationships
        article = article.reload

        format.json { render json: article, status: :created, location: article }
      else
        format.json { render json: article.errors, status: :unprocessable_entity }
      end
    end
  end

  def autocomplete
    current_user_id = current_user ? current_user.id : nil

    results = Article.search(params[:autocompleteQuery], autocomplete: true, limit: 6)
                  .records
                  .includes(:translations, :tags)
                  .user_related(current_user_id)

    respond_to do |format|
      format.html { render json: results, each_serializer: AutocompleteSerializer, content_type: 'application/json' }
      format.json { render json: results, each_serializer: AutocompleteSerializer }
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

    articles = results[:articles].includes(:translations, :author, :tags).user_related(current_user_id)

    respond_to do |format|
      format.html { render json: articles,
                           highlight: results[:highlight],
                           suggestions: results[:suggestions],
                           each_serializer: SearchSerializer, content_type: 'application/json' }
      format.json { render json: articles,
                           highlight: results[:highlight],
                           suggestions: results[:suggestions],
                           each_serializer: SearchSerializer }
    end
  end

  def show
    article = Article.friendly.find(params[:id])
    authorize article

    respond_to do |format|
      format.html { render :show, locals: {article: article} }
    end
  end

  def history
    article = Article.friendly.find(params[:id])
    authorize article

    article_versions = article.translation.versions

    respond_to do |format|
      format.html { render json: article_versions, each_serializer: HistorySerializer, content_type: 'application/json' }
      format.json { render json: article_versions, each_serializer: HistorySerializer }
    end
  end

  def edit
    article = Article.friendly.find(params[:id])
    authorize article

    current_user_id = current_user ? current_user.id : nil
    multi_language = (current_user.read_preference(:multi_language) == 'true')

    respond_to do |format|
      format.html { render :edit, locals: {
          article: article,
          current_user_id: current_user_id,
          multi_language: multi_language
      }
      }
    end
  end

  def update
    article = Article.find(params[:id])
    authorize article

    respond_to do |format|
      if current_user.read_preference(:multi_language) == 'true' ?
          article.update_attributes(article_translated_params) :
          article.update_attributes(article_params)

        format.json { render json: article, status: :accepted, location: article }
      else
        format.json { render json: article.errors, status: :not_modified }
      end
    end
  end

  def bookmark
    article = Article.find(params[:id])
    authorize article

    if current_user.bookmarks.exists?(article.id)
      current_user.bookmarks.delete(article)
    else
      current_user.bookmarks.push(article)
    end

    respond_to do |format|
      if current_user.save
        format.json { render json: article, status: :accepted, location: article }
      else
        format.json { render json: article.errors, status: :not_modified }
      end
    end
  end

  def restore
    article = if params[:article_version_id]
                if params[:from_deletion]
                  article_version = PaperTrail::Version.find_by_id(params[:article_version_id])
                  if article_version
                    article_version.reify
                  end
                end
              else
                Article.find(params[:id])
              end
    authorize article

    translation_version = PaperTrail::Version.find_by_id(params[:translation_version_id])

    if (translation = translation_version.reify)
      if params[:article_version_id]
        article.save
      else
        translation.save
      end

      article.reload

      respond_to do |format|
        flash[:success] = t('views.article.flash.undeletion_successful') if params[:from_deletion]
        format.html { redirect_to article_path(article) }
        format.json { render json: article, status: :accepted, location: article }
      end
    else
      skip_authorization
      # For undoing the create action
      translation_version.item.destroy
      article_version.item.destroy if params[:article_version_id] && params[:from_deletion]
      respond_to do |format|
        flash[:error] = t('views.article.flash.not_found')
        format.html { render json: {}, formats: :json, content_type: 'application/json' }
        format.json { render json: {}, status: :not_found }
      end
    end
  end

  def destroy
    article = Article.find(params[:id])
    authorize article

    translation_item_id = article.translation.versions.last.item_id

    respond_to do |format|
      if article.destroy
        last_article_version = article.versions.last
        last_translation_version = PaperTrail::Version.where(item_id: translation_item_id, event: 'destroy').last
        if last_article_version && last_translation_version
          undelete_url = restore_article_path(article_version_id: last_article_version.id,
                                              translation_version_id: last_translation_version.id,
                                              from_deletion: true)

          flash[:success] = t('views.article.flash.deletion_successful',
                              restore_link: undelete_url)
        end
        format.json { render json: {id: article.id}, status: :accepted }
      else
        flash[:error] = t('views.article.flash.deletion_error', errors: article.errors.to_s)
        format.json { render json: article.errors, status: :not_modified }
      end
    end
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
                                     :temporary,
                                     :is_link,
                                     tags_attributes: [:id, :tagger_id, :name, :parent, :child])
  end

  def article_translated_params
    params.require(:articles).permit(:visibility,
                                     :notation,
                                     :priority,
                                     :allow_comment,
                                     :is_link,
                                     translations_attributes: [:id, :locale, :title, :summary, :content],
                                     tags_attributes: [:id, :tagger_id, :name, :parent, :child])
  end
end
