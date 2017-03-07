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
  after_action :verify_authorized, except: [:index]

  include CommentConcern
  include TrackerConcern

  respond_to :html, :json

  def index
    articles = Article
                 .includes(:parent_tags, :child_tags, :tracker, user: [:picture])
                 .user_related(current_user&.id)
                 .order('articles.id DESC')

    articles = if params[:parent_tags] && params[:child_tags]
                 parent_tags       = params[:parent_tags]
                 child_tags        = params[:child_tags]
                 parent_articles   = Article.with_parent_tags(parent_tags)
                 children_articles = Article.with_child_tags(child_tags)
                 articles.joins(:tags).where(id: parent_articles.ids & children_articles.ids)
               elsif params[:tags] || params[:parent_tags] || params[:child_tags]
                 tag_names = params[:tags] || params[:parent_tags] || params[:child_tags]
                 articles.with_tags(tag_names)
               elsif params[:type] == 'bookmark'
                 articles.where(id: current_user.bookmarks.ids)
               elsif params[:type] == 'draft'
                 articles.where(draft: true)
               else
                 articles.published
               end

    articles = articles.where(user_id: User.friendly.find(params[:user_id])) if params[:user_id]
    articles = articles.where(topic_id: Topic.friendly.find(params[:topic_id])) if params[:topic_id]
    articles = params[:limit] ? articles.limit(params[:limit]) : articles.paginate(page: params[:page], per_page: CONFIG.per_page)
    articles = articles.uniq

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
    authorize article

    Article.track_views(article.id)
    User.track_views(article.user.id)
    Tag.track_views(article.tags.ids)

    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.article.show.title')),
                      description: I18n.t('views.article.show.description'),
                      author:      user_canonical_url(article.user.slug),
                      canonical:   article_canonical_url(article.slug),
                      alternate:   alternate_urls('articles', article.slug),
                      og:          {
                        type:  'InRailsWeBlog:article',
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
    authorize article

    article_versions = article.versions.select { |history| !history.reify.content.empty? }

    respond_to do |format|
      format.json do
        render json:            article_versions,
               each_serializer: HistorySerializer
      end
    end
  end

  def create
    article = current_user.articles.build
    authorize article

    article.format_attributes(article_params, current_user)

    respond_to do |format|
      format.json do
        if article.save
          article.create_tag_relationships
          article.tags_to_topic(current_user, new_tags: article.tags)

          flash.now[:success] = t('views.article.flash.successful_creation')
          render json:       article,
                 new_tags:   article.tags,
                 serializer: ArticleSerializer,
                 status:     :created
        else
          flash.now[:error] = t('views.article.flash.error_creation')
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end

  def edit
    article = Article.includes(:user,
                               :parent_tags,
                               :child_tags,
                               :tagged_articles,
                               :tracker,
                               bookmarked_articles: [:user, :article],
                               comment_threads:     [:user])
                .friendly.find(params[:id])
    authorize article

    respond_to do |format|
      format.html do
        set_meta_tags title:       titleize(I18n.t('views.article.edit.title')),
                      description: I18n.t('views.article.edit.description'),
                      canonical:   article_canonical_url("#{article.id}/edit")
        render :edit, locals:
          {
            article:         article,
            current_user_id: current_user&.id,
          }
      end
    end
  end

  def update
    article = Article.find(params[:id])
    authorize article

    previous_tags        = article.tags
    previous_parent_tags = Tag.where(id: article.parent_tags.ids)
    previous_child_tags  = Tag.where(id: article.child_tags.ids)

    article.format_attributes(article_params, current_user)

    respond_to do |format|
      format.json do
        if article.save
          article.update_tag_relationships(previous_parent_tags, previous_child_tags)
          article.tags_to_topic(current_user, new_tags: article.tags - previous_tags, old_tags: previous_tags - article.tags)
          Tag.remove_unused_tags(previous_tags - article.tags)

          render json:   article,
                 status: :ok
        else
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end

  def restore
    article_version = nil

    article = if params[:article_version_id]
                if params[:from_deletion]
                  article_version = PaperTrail::Version.find_by_id(params[:article_version_id])
                  article_version.reify if article_version
                end
              else
                Article.find(params[:id])
              end
    authorize article

    version = PaperTrail::Version.find_by_id(params[:version_id])

    if (restored_version = version.reify)
      params[:article_version_id] ? article.save : restored_version.save

      article.reload
      article.create_tag_relationships

      respond_to do |format|
        flash.now[:success] = t('views.article.flash.undeletion_successful') if params[:from_deletion]
        format.html do
          redirect_to article_path(article)
        end
        format.json do
          render json:   article,
                 status: :accepted
        end
      end
    else
      skip_authorization
      # For undoing the create action
      version.item.destroy
      article_version.item.destroy if article_version && params[:article_version_id] && params[:from_deletion]
      respond_to do |format|
        flash.now[:error] = t('views.article.flash.not_found')
        format.html do
          # set_meta_tags title:       titleize(I18n.t('views.article.edit.title')),
          #               description: I18n.t('views.article.edit.description'),
          #               canonical:   article_canonical_url("#{article.id}/edit")
          render json:         {},
                 formats:      :json,
                 content_type: 'application/json'
        end
        format.json do
          render json:   {},
                 status: :not_found
        end
      end
    end
  end

  def destroy
    article = Article.find(params[:id])
    authorize article

    item_id = article.versions.last.item_id

    previous_tags        = article.tags
    previous_parent_tags = Tag.where(id: article.parent_tags.ids)
    previous_child_tags  = Tag.where(id: article.child_tags.ids)

    respond_to do |format|
      format.json do
        if article.destroy
          article.delete_tag_relationships(previous_parent_tags, previous_child_tags)
          article.tags_to_topic(current_user, old_tags: previous_tags)
          Tag.remove_unused_tags(previous_tags)

          last_article_version = article.versions.last
          last_version         = PaperTrail::Version.where(item_id: item_id, event: 'destroy').last
          undelete_url         = nil
          if last_article_version && last_version
            undelete_url = restore_article_path(article_version_id: last_article_version.id,
                                                version_id:         last_version.id,
                                                from_deletion:      true)

            flash.now[:success] = t('views.article.flash.deletion_successful') +
              ' ' +
              "<a href='#{undelete_url}'>#{t('views.article.flash.undelete_link')}</a>"
          end
          render json:   { id: article.id, url: undelete_url },
                 status: :accepted
        else
          flash.now[:error] = t('views.article.flash.deletion_error', errors: article.errors.to_s)
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end

  private

  def article_params
    params.require(:articles).permit(:title,
                                     :summary,
                                     :description,
                                     :content,
                                     :visibility,
                                     :notation,
                                     :priority,
                                     :allow_comment,
                                     :draft,
                                     :topic,
                                     parent_tags: [],
                                     child_tags:  [])
  end
end
