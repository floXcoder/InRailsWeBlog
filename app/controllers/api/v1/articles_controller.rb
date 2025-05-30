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
    skip_before_action :authenticate_user!, only: [:index, :show, :shared, :recommendations]

    before_action :honeypot_protection, only: [:create, :update]

    before_action :set_context_user, except: [:index, :shared]

    after_action :verify_authorized, except: [:index]

    include TrackerConcern
    include CommentConcern
    include VisitHelper

    respond_to :json

    def index
      complete = filter_params[:complete] && admin_signed_in?

      if complete
        articles = ::Articles::FindQueries.new(nil, current_admin).complete(filter_params.merge(visibility: 'everyone'))
      elsif params[:populars]
        articles = component_cache('popular_articles') do
          Article.serialized_json(::Articles::FindQueries.new.populars(limit: params[:limit]&.to_i, with_locale: I18n.locale),
                                  params: {
                                    current_user_id: current_user&.id
                                  })

        end
      elsif params[:home]
        articles = component_cache('home_articles') do
          Article.serialized_json(::Articles::FindQueries.new.home(limit: params[:limit]&.to_i, with_locale: I18n.locale),
                                  params: {
                                    current_user_id: current_user&.id
                                  })
        end
      else
        articles = ::Articles::FindQueries.new(current_user, current_admin).all(filter_params.merge(page: params[:page]&.to_i, limit: params[:limit]&.to_i))

        if filter_params[:tag_slug].present? || filter_params[:parent_tag_slug].present?
          languages = articles.map(&:languages).flatten.uniq
          if filter_params[:topic_slug].present?
            set_seo_data(:tagged_topic_articles,
                         tag_slug:   filter_params[:parent_tag_slug].presence || filter_params[:tag_slug].presence,
                         topic_slug: filter_params[:topic_slug],
                         user_slug:  filter_params[:user_slug],
                         languages:  languages)
          else
            set_seo_data(:tagged_articles,
                         tag_slug:  filter_params[:parent_tag_slug].presence || filter_params[:tag_slug].presence,
                         languages: languages)
          end
        elsif filter_params[:topic_slug].present?
          context_topic = articles.first&.topic
          set_seo_data(:topic_articles,
                       topic_slug:    filter_params[:topic_slug],
                       user_slug:     filter_params[:user_slug],
                       topic_content: context_topic&.description&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true),
                       exclude_slugs: [:topic_content],
                       languages:     context_topic&.languages)
        elsif filter_params[:user_slug].present?
          languages = articles.map(&:languages).flatten.uniq
          set_seo_data(:user_articles,
                       user_slug: filter_params[:user_slug],
                       languages: languages)
        end
      end

      tracking_data = params[:home].present? || params[:populars].present? ? nil : { article_ids: articles.map(&:id), tag_slug: filter_params[:tag_slug], topic_slug: filter_params[:topic_slug], user_slug: filter_params[:user_slug] }

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if articles.is_a?(Hash) || (!with_cache? || stale?(articles, template: false, public: true))
        respond_to do |format|
          format.json do
            if complete
              render json: Article.serialized_json(articles,
                                                   'complete',
                                                   params: {
                                                     current_user_id: current_user&.id,
                                                     no_cache:        true
                                                   },
                                                   meta:   {
                                                     trackingData: tracking_data,
                                                     **meta_attributes
                                                   })
            elsif params[:summary].present?
              render json: if articles.is_a?(Hash)
                             articles
                           else
                             Article.serialized_json(articles,
                                                     params: {
                                                       current_user_id: current_user&.id
                                                     },
                                                     meta:   {
                                                       trackingData: tracking_data,
                                                       storyTopic:   filter_params[:topic_slug].present? && articles.present? && articles.all?(&:story?) ? articles.first.topic.flat_serialized_json(with_model: false) : nil,
                                                       **(params[:populars] || params[:home] ? {} : meta_attributes(pagination: articles))
                                                     })
                           end
            else
              render json: if articles.is_a?(Hash)
                             articles
                           else
                             Article.serialized_json(articles,
                                                     'normal',
                                                     params: {
                                                       current_user_id: current_user&.id
                                                     },
                                                     meta:   {
                                                       trackingData: tracking_data,
                                                       **meta_attributes(pagination: articles)
                                                     })
                           end
            end
          end
        end
      end
    end

    def show
      article = @context_user.articles.friendly.find(params[:id])
      admin_or_authorize article

      with_cache?(article) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache?(article) || stale?(article, template: false, public: true)
        respond_to do |format|
          format.json do
            set_seo_data(:user_article,
                         article_slug:    article,
                         article_content: article.content&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true, remove_code: true),
                         topic_slug:      article.topic,
                         user_slug:       article.user,
                         author:          article.user.pseudo,
                         model:           article,
                         og:              {
                                            type:  "#{ENV['WEBSITE_NAME']}:article",
                                            url:   article.link_path(host: ENV['WEBSITE_URL']),
                                            image: article.default_picture[:jpg]
                                          }.compact)

            if current_user && article.user?(current_user)
              render json: article.serialized_json('complete',
                                                   params: {
                                                     current_user_id: current_user&.id,
                                                     no_cache:        true
                                                   },
                                                   meta:   {
                                                     trackingData: { article_id: article.id, topic_id: article.topic_id },
                                                     **meta_attributes
                                                   })
            else
              render json: article.serialized_json('normal',
                                                   meta: {
                                                           trackingData: { article_id: article.id, topic_id: article.topic_id },
                                                           storyTopic:   article.story? ? article.topic.flat_serialized_json(with_model: false) : nil,
                                                           **(params[:no_meta] ? {} : meta_attributes)
                                                         }.compact)
            end
          end
        end
      end
    end

    def shared
      article              = Share.where(public_link: params[:public_link]).first&.shareable
      article&.shared_link = params[:public_link]
      admin_or_authorize article

      track_action(action: 'article_shared', article_id: article.id, topic_id: article.topic_id)

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache? || stale?(article, template: false, public: true)
        respond_to do |format|
          format.json do
            set_seo_data(:shared_article,
                         article_slug: article,
                         topic_slug:   article.topic,
                         user_slug:    article.user,
                         author:       article.user.pseudo,
                         model:        article,
                         og:           {
                                         type:  "#{ENV['WEBSITE_NAME']}:article",
                                         url:   article.link_path(host: ENV['WEBSITE_URL']),
                                         image: article.default_picture[:jpg]
                                       }.compact)

            render json: article.serialized_json('normal', meta: {
                                                                   storyTopic: article.story? ? article.topic.flat_serialized_json(with_model: false) : nil,
                                                                   **meta_attributes
                                                                 }.compact)
          end
        end
      end
    end

    def check_links
      article = Article.find(params[:id])
      admin_or_authorize article

      article.check_dead_links!

      respond_to do |format|
        format.json do
          render json: article.serialized_json('complete', params: { current_user_id: current_user&.id })
        end
      end
    end

    def recommendations
      article = @context_user.articles.include_element.find(params[:id])
      admin_or_authorize article

      articles = ::Articles::FindQueries.new(@context_user, current_admin).recommendations(article: article)

      with_cache?(article) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache?(article) || stale?(articles, template: false, public: true)
        respond_to do |format|
          format.json do
            render json: Article.serialized_json(articles,
                                                 'normal',
                                                 params: {
                                                   current_user_id: current_user&.id
                                                 },
                                                 meta:   { root: 'recommendations' })
          end
        end
      end
    end

    def tracking
      article = current_admin ? Article.find(params[:id]) : @context_user.articles.include_element.find(params[:id])
      admin_or_authorize article

      article_page_visits = Ahoy::Event.left_outer_joins(:visit).select('distinct ahoy_visits.visitor_token').where(name: 'page_visit', 'ahoy_visits.validated': true).where("properties->>'article_id' = ?", article.id.to_s)
      article_uniq_visits = Ahoy::Visit.validated.external.where(id: article_page_visits.pluck(:visit_id).uniq)

      tracking_data = {
        tracker:        TrackerSerializer.new(article.tracker).flat_serializable_hash,
        bookmarksCount: article.bookmarks_count,
        commentsCount:  article.comments_count,
        datesCount:     article_page_visits.order('DATE(time) DESC').group('DATE(time)').count,
        countries:      format_tracking(article_uniq_visits.group_by(&:country), 8),
        browsers:       format_tracking(article_uniq_visits.group_by(&:browser), 8),
        os:             format_tracking(article_uniq_visits.group_by(&:os), 8),
        utmSources:     format_tracking(article_uniq_visits.group_by(&:utm_source), 8),
        referrers:      format_tracking(article_uniq_visits.group_by(&:referring_domain), 10)
      }

      respond_to do |format|
        format.json do
          render json: {
                         trackingData: tracking_data,
                         article:      params[:with_article] ? Article.serialized_json(article, 'normal') : nil
                       }.compact
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
                       article_slug: article,
                       topic_slug:   article.topic,
                       user_slug:    article.user,
                       author:       article.user.pseudo,
                       model:        article)

          render json: HistorySerializer.new(article_versions,
                                             meta: {
                                               root:         'history',
                                               trackingData: { article_id: article.id },
                                               **meta_attributes
                                             }).serializable_hash
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
            track_action(action: 'article_create', article_id: stored_article.result.id)

            flash.now[:success] = stored_article.message
            render json:   stored_article.result.serialized_json('complete',
                                                                 params: {
                                                                   current_user_id: current_user&.id
                                                                 },
                                                                 meta:   meta_attributes),
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
      article = Article.include_element.friendly.find(params[:id])
      admin_or_authorize article

      track_action(action: 'article_edit', article_id: article.id, topic_id: article.topic_id)

      respond_to do |format|
        format.json do
          set_seo_data(:edit_article,
                       article_slug: article,
                       topic_slug:   article.topic,
                       user_slug:    article.user,
                       author:       article.user.pseudo,
                       model:        article)

          render json: article.serialized_json('complete',
                                               params: {
                                                 current_user_id: current_user.id
                                               },
                                               meta:   {
                                                 trackingData: { article_id: article.id, topic_id: article.topic_id },
                                                 **meta_attributes
                                               })
        end
      end
    end

    def update
      article = Article.include_element.friendly.find(params[:id])
      admin_or_authorize article

      stored_article = ::Articles::StoreService.new(article, article_params.merge(article_admin_params).merge(current_user: current_user, auto_save: params[:auto_save], was_auto_saved: params[:was_auto_saved])).perform

      respond_to do |format|
        format.json do
          if stored_article.success?
            track_action(action: 'article_update', article_id: stored_article.result.id)

            expire_home_cache if (user_signed_in? || admin_signed_in?) && article_admin_params.present?

            flash.now[:success] = stored_article.message unless params[:auto_save]
            render json:   stored_article.result.serialized_json('complete',
                                                                 params: {
                                                                   current_user_id: current_user.id
                                                                 },
                                                                 meta:   meta_attributes),
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
            render json:   Article.serialized_json(articles.reverse, 'complete', params: { current_user_id: current_user&.id }),
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

        track_action(action: 'article_restore', article_id: article.id)

        respond_to do |format|
          flash.now[:success] = t('views.article.flash.successful_undeletion') if params[:from_deletion]
          format.json do
            render json:   article.serialized_json,
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
          if (params[:permanently] && current_admin) || article.draft? ? article.really_destroy! : article.destroy
            track_action(action: 'article_destroy', article_id: article.id)

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
                                      :picture_ids,
                                      title_translations:   {},
                                      summary_translations: {},
                                      content_translations: {},
                                      inventories:          {},
                                      tags:                 [
                                                              :name,
                                                              :visibility,
                                                              :new
                                                            ],
                                      parent_tags:          [
                                                              :name,
                                                              :visibility,
                                                              :new
                                                            ],
                                      child_tags:           [
                                                              :name,
                                                              :visibility,
                                                              :new
                                                            ])
    end

    def article_admin_params
      if admin_signed_in?
        params.require(:article).permit(:rank,
                                        :home_page)
      else
        {}
      end
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
                                       topic_ids: []).compact_blank
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
