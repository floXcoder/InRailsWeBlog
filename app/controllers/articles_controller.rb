# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  link         :boolean          default(FALSE), not null
#  draft       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticlesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :verify_requested_format!
  after_action :verify_authorized, except: [:index]

  include TrackerConcern
  include CommentConcern

  respond_to :html, :json

  def index
    articles = Article.includes(:tags, :parent_tags, :child_tags, user: [:picture])
                 .order('articles.updated_at DESC')
                 .distinct

    articles = articles.default_visibility(current_user, current_admin)

    articles = Article.filter_by(articles, filter_params, current_user) unless filter_params.empty?

    articles = params[:limit] ? articles.limit(params[:limit]) : articles.paginate(page: params[:page], per_page: Setting.per_page)

    respond_to do |format|
      format.json do
        if params[:summary]
          render json:            articles,
                 each_serializer: ArticleSampleSerializer,
                 meta:            meta_attributes(articles)
        else
          render json:            articles,
                 each_serializer: ArticleSerializer
        end
      end
    end
  end

  def show
    article = Article.includes(:user,
                               :parent_tags,
                               :child_tags,
                               :tagged_articles,
                               :tracker)
                .friendly.find(params[:id])
    admin_or_authorize article

    Article.track_views(article.id)
    User.track_views(article.user.id)
    Tag.track_views(article.tags.ids)

    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.article.show.title')),
                      description: article.meta_description,
                      author:      alternate_urls(article.user.slug)['fr'],
                      canonical:   alternate_urls(article.slug)['fr'],
                      alternate:   alternate_urls('articles', article.slug),
                      og:          {
                        type:  "#{ENV['WEBSITE_NAME']}:article",
                        url:   article_url(article),
                        image: root_url + article.default_picture
                      }
        render :show, locals: { article: article }
      end
      format.json do
        render json:       article,
               serializer: ArticleSerializer
      end
    end
  end

  def history
    article = Article.friendly.find(params[:id])
    admin_or_authorize article

    article_versions = article.versions.select { |history| !history.reify.content.nil? }

    respond_to do |format|
      format.json do
        render json:            article_versions,
               root:            'history',
               each_serializer: HistorySerializer
      end
    end
  end

  def create
    article = current_user.articles.build
    admin_or_authorize article

    article.format_attributes(article_params, current_user)

    respond_to do |format|
      format.json do
        if article.save
          flash.now[:success] = t('views.article.flash.successful_creation')
          render json:       article,
                 serializer: ArticleSerializer,
                 status:     :created
        else
          flash.now[:error] = t('views.article.flash.error_creation')
          render json:   { errors: article.errors },
                 status: :forbidden
        end
      end
    end
  end

  def edit
    article = Article.includes(:user,
                               :parent_tags,
                               :child_tags)
                .friendly.find(params[:id])
    admin_or_authorize article

    respond_to do |format|
      format.html do
        set_meta_tags title:       titleize(I18n.t('views.article.edit.title', title: article.title)),
                      description: I18n.t('views.article.edit.description', title: article.title),
                      canonical:   article_canonical_url("#{article.id}/edit")
        render :edit, locals: {
          article:         article,
          current_user_id: current_user&.id
        }
      end
    end
  end

  def update
    article = Article.find(params[:id])
    admin_or_authorize article

    article.format_attributes(article_params, current_user)

    respond_to do |format|
      format.json do
        if article.save
          render json:   article,
                 status: :ok
        else
          render json:   { errors: article.errors },
                 status: :forbidden
        end
      end
    end
  end

  def restore
    article = Article.with_deleted.find(params[:id])
    admin_or_authorize article

    version = PaperTrail::Version.find_by(id: params[:version_id])

    if version && (restored_version = version.reify)
      params[:article_version_id] ? article.save : restored_version.save

      article.reload

      respond_to do |format|
        flash.now[:success] = t('views.article.flash.undeletion_successful') if params[:from_deletion]
        # format.html do
        #   redirect_to article_path(article)
        # end
        format.json do
          render json:   article,
                 status: :accepted
        end
      end
    else
      respond_to do |format|
        flash.now[:error] = t('views.article.flash.not_found')
        # format.html do
        #   # set_meta_tags title:       titleize(I18n.t('views.article.edit.title')),
        #   #               description: I18n.t('views.article.edit.description'),
        #   #               canonical:   article_canonical_url("#{article.id}/edit")
        #   render json:         {},
        #          formats:      :json,
        #          content_type: 'application/json'
        # end
        format.json do
          render json:   {},
                 status: :not_found
        end
      end
    end
  end

  def destroy
    article = Article.find(params[:id])
    admin_or_authorize article

    respond_to do |format|
      format.json do
        if params[:permanently] && current_admin ? article.really_destroy! : article.destroy
          # TODO : remove now or later (cron job) ?
          # Tag.remove_unused_tags(article.tags)

          flash.now[:success] = I18n.t('views.article.flash.successful_deletion')
          head :no_content
        else
          flash.now[:error] = I18n.t('views.article.flash.deletion_error', errors: article.errors.to_s)
          render json:   { errors: article.errors },
                 status: :forbidden
        end
      end
    end
  end

  private

  def article_params
    params.require(:article).permit(:title,
                                    :summary,
                                    :description,
                                    :content,
                                    :visibility,
                                    :notation,
                                    :priority,
                                    :allow_comment,
                                    :draft,
                                    :topic_id,
                                    tags:        [],
                                    parent_tags: [],
                                    child_tags:  [])
  end

  def filter_params
    if params[:filter]
      params.require(:filter).permit(:visibility,
                                     :draft,
                                     :accepted,
                                     :user_id,
                                     :user_slug,
                                     :topic_id,
                                     :topic_slug,
                                     :bookmarked,
                                     user_ids:         [],
                                     topic_ids:        [],
                                     parent_tag_slugs: [],
                                     child_tag_slugs:  [],
                                     tag_slugs:        []).reject { |_, v| v.blank? }
    else
      {}
    end
  end

end
