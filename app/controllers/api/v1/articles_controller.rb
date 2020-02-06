# frozen_string_literal: true

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

module Api::V1
  class ArticlesController < ApiController
    skip_before_action :authenticate_user!, only: [:index, :show, :shared, :stories]

    before_action :honeypot_protection, only: [:create, :update]

    before_action :set_context_user, except: [:index]

    after_action :verify_authorized, except: [:index, :stories]

    include TrackerConcern
    include CommentConcern

    respond_to :json

    def index
      complete = filter_params[:complete] && admin_signed_in?

      articles = if complete
                   ::Articles::FindQueries.new(nil, current_admin).complete
                 elsif params[:home]
                   ::Articles::FindQueries.new.home(limit: params[:limit])
                 elsif params[:populars]
                   ::Articles::FindQueries.new.populars(limit: params[:limit])
                 else
                   ::Articles::FindQueries.new(current_user, current_admin).all(filter_params.merge(page: params[:page], limit: params[:limit]))
                 end

      respond_to do |format|
        format.json do
          if filter_params[:tag_slug].present?
            if filter_params[:topic_slug].present?
              set_seo_data(:tagged_topic_articles,
                           tag_slug:   Tag.find_by(slug: filter_params[:parent_tag_slug].presence || filter_params[:tag_slug].presence)&.name,
                           topic_slug: Topic.find_by(slug: filter_params[:topic_slug])&.name,
                           user_slug:  User.find_by(slug: filter_params[:user_slug])&.pseudo)
            else
              set_seo_data(:tagged_articles,
                           tag_slug:  Tag.find_by(slug: filter_params[:parent_tag_slug].presence || filter_params[:tag_slug].presence)&.name,
                           user_slug: User.find_by(slug: filter_params[:user_slug])&.pseudo)
            end
          elsif filter_params[:topic_slug].present?
            set_seo_data(:topic_articles,
                         topic_slug: Topic.find_by(slug: filter_params[:topic_slug]).name,
                         user_slug:  User.find_by(slug: filter_params[:user_slug]).pseudo)
          else
            set_seo_data(:user_articles,
                         user_slug: User.find_by(slug: filter_params[:user_slug]))
          end

          if complete
            render json: ArticleCompleteSerializer.new(articles,
                                                       include: [:tracker],
                                                       meta:    { root: 'articles', **meta_attributes })
          elsif params[:summary]
            render json: ArticleSampleSerializer.new(articles,
                                                     include: [:user, :tags],
                                                     meta:    { root: 'articles', **meta_attributes }),
                   meta: meta_attributes(pagination: articles)
          else
            render json: ArticleSerializer.new(articles,
                                               include: [:user, :topic, :tracker, :tags],
                                               params:  { current_user_id: current_user&.id, with_outdated: true },
                                               meta:    { root: 'articles', **meta_attributes }),
                   meta: meta_attributes(pagination: articles)
          end
        end
      end
    end

    def show
      article = @context_user.articles.include_element.friendly.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.json do
          set_seo_data(:user_article,
                       article_slug: article.title,
                       topic_slug:   article.topic.name,
                       user_slug:    article.user.pseudo,
                       author:       article.user.pseudo,
                       canonical:    article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                       og:           {
                                       type:  "#{ENV['WEBSITE_NAME']}:article",
                                       url:   article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                                       image: article.default_picture ? (root_url + article.default_picture) : nil
                                     }.compact)

          render json: ArticleSerializer.new(article,
                                             include: [:user, :topic, :tracker, :tags],
                                             params:  {
                                               current_user_id: current_user&.id,
                                               with_share:      true,
                                               with_vote:       true,
                                               with_outdated:   true,
                                               with_tracking:   params[:complete] && current_user && article.user?(current_user)
                                             },
                                             meta:    meta_attributes)
        end
      end
    end

    def shared
      article             = @context_user.articles.include_element.friendly.find(params[:id])
      article.shared_link = params[:public_link]
      admin_or_authorize article

      respond_to do |format|
        format.json do
          set_seo_data(:shared_article,
                       article_slug: article.title,
                       topic_slug:   article.topic.name,
                       user_slug:    article.user.pseudo,
                       author:       article.user.pseudo,
                       canonical:    article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                       og:           {
                                       type:  "#{ENV['WEBSITE_NAME']}:article",
                                       url:   article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                                       image: article.default_picture ? (root_url + article.default_picture) : nil
                                     }.compact)

          render json: ArticleSerializer.new(article,
                                             include: [:user, :topic, :tracker, :tags],
                                             params:  { current_user_id: current_user&.id },
                                             meta:    meta_attributes)
        end
      end
    end

    def stories
      article = @context_user.articles.include_element.friendly.find(params[:id])

      articles = ::Articles::FindQueries.new(@context_user, current_admin).stories(topic_id: article.topic_id)

      respond_to do |format|
        format.json do
          render json: ArticleSampleSerializer.new(articles,
                                                   include: [:user, :tags],
                                                   meta:    { root: 'stories' })
        end
      end
    end

    def history
      article = current_user.articles.friendly.find(params[:id])
      admin_or_authorize article

      article_versions = article.versions.where(event: 'update').map.with_index { |h, i| h.object_changes.present? || i == 0 ? h : nil }.compact.reverse

      respond_to do |format|
        format.json do
          set_seo_data(:history_article,
                       article_slug: article.title,
                       topic_slug:   article.topic.name,
                       user_slug:    article.user.pseudo,
                       author:       article.user.pseudo)

          render json: HistorySerializer.new(article_versions,
                                             meta: { root: 'history', **meta_attributes })
        end
      end
    end

    def create
      article = Article.new
      admin_or_authorize article

      stored_article = ::Articles::StoreService.new(article, article_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_article.success?
            flash.now[:success] = stored_article.message
            render json:   ArticleSerializer.new(stored_article.result,
                                                 include: [:user, :topic, :tracker, :tags],
                                                 params:  { current_user_id: current_user&.id }),
                   status: :created
          else
            flash.now[:error] = stored_article.message
            render json:   { errors: stored_article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def edit
      article = current_user.articles.include_element.friendly.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.json do
          set_seo_data(:edit_article,
                       article_slug: article.title,
                       topic_slug:   article.topic.name,
                       user_slug:    article.user.pseudo,
                       author:       article.user.pseudo)

          render json: ArticleSerializer.new(article,
                                             include: [:user, :topic, :tracker, :tags],
                                             params:  { current_user_id: current_user&.id },
                                             meta:    meta_attributes)
        end
      end
    end

    def update
      article = current_user.articles.friendly.find(params[:id])
      admin_or_authorize article

      stored_article = ::Articles::StoreService.new(article, article_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_article.success?
            flash.now[:success] = stored_article.message unless params[:auto_save]
            render json:   ArticleSerializer.new(stored_article.result,
                                                 params:  {
                                                   current_user_id: current_user&.id,
                                                   with_share:      true,
                                                   with_vote:       true,
                                                   with_outdated:   true
                                                 },
                                                 include: [:user, :topic, :tracker, :tags]),
                   status: :ok
          else
            flash.now[:error] = stored_article.message
            render json:   { errors: stored_article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update_priority
      articles = []
      priority_params[:article_ids].reverse.each_with_index do |id, i|
        article = Article.find(id)
        admin_or_authorize article, :update?
        articles << article if article.update_columns(priority: i + 1)
      end

      respond_to do |format|
        format.json do
          if articles.present?
            flash.now[:success] = t('views.article.flash.successful_priority_update')
            render json:   ArticleSerializer.new(articles.reverse,
                                                 include: [:user, :topic, :tracker, :tags],
                                                 params:  { current_user_id: current_user&.id },
                                                 meta:    { root: 'articles' }),
                   status: :ok
          else
            flash.now[:error] = t('views.article.flash.error_priority_update')
            render json:   { errors: t('views.article.flash.error_priority_update') },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def restore
      article = current_user.articles.with_deleted.find(params[:id])
      admin_or_authorize article

      version = PaperTrail::Version.find_by(id: params[:version_id])

      if version && (restored_version = version.reify)
        params[:article_version_id] ? article.save : restored_version.save

        article.reload

        respond_to do |format|
          flash.now[:success] = t('views.article.flash.successful_undeletion') if params[:from_deletion]
          format.json do
            render json:   ArticleSerializer.new(article,
                                                 include: [:user, :topic, :tracker, :tags],
                                                 params:  { current_user_id: current_user&.id }),
                   status: :accepted
          end
        end
      else
        respond_to do |format|
          flash.now[:error] = t('views.article.flash.not_found')
          format.json do
            render json:   {},
                   status: :not_found
          end
        end
      end
    end

    def destroy
      article = current_user.articles.find(params[:id])
      admin_or_authorize article

      respond_to do |format|
        format.json do
          if params[:permanently] && current_admin ? article.really_destroy! : article.destroy
            flash.now[:success] = I18n.t('views.article.flash.successful_deletion')
            head :no_content
          else
            flash.now[:error] = I18n.t('views.article.flash.error_deletion', errors: article.errors.to_s)
            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def article_params
      params.require(:article).permit(:mode,
                                      :title,
                                      :summary,
                                      :content,
                                      :reference,
                                      :visibility,
                                      :notation,
                                      :priority,
                                      :allow_comment,
                                      :draft,
                                      :topic_id,
                                      :language,
                                      :picture_ids,
                                      inventories: {},
                                      tags:        [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ],
                                      parent_tags: [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ],
                                      child_tags:  [
                                                     :name,
                                                     :visibility,
                                                     :new
                                                   ])
    end

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:visibility,
                                       :mode,
                                       :draft,
                                       :accepted,
                                       :user_id,
                                       :user_slug,
                                       :topic_id,
                                       :topic_slug,
                                       :shared_topic,
                                       :tag_id,
                                       :tag_slug,
                                       :parent_tag_slug,
                                       :child_tag_slug,
                                       :bookmarked,
                                       :order,
                                       :complete,
                                       user_ids:  [],
                                       topic_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end

    def priority_params
      if params[:article_ids]
        params.permit(article_ids: [])
      else
        {}
      end
    end

  end
end
