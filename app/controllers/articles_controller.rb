# frozen_string_literal: true

class ArticlesController < ApplicationController
  before_action :set_context_user, only: [:show]

  after_action :verify_authorized, only: [:show, :edit]

  respond_to :html

  def index
    if article_params[:topic_slug].present?
      set_seo_data(:topic_articles,
                   topic_slug: article_params[:topic_slug],
                   user_slug:  article_params[:user_slug])
    elsif article_params[:tag_slug].present? || article_params[:parent_tag_slug].present?
      set_seo_data(:tagged_articles,
                   tag_slug: article_params[:parent_tag_slug].presence || article_params[:tag_slug].presence)
    elsif article_params[:user_slug].present?
      set_seo_data(:user_articles,
                   user_slug: article_params[:user_slug])
    end

    articles = ::Articles::FindQueries.new(current_user, current_admin).all(article_params)

    (user_signed_in? || admin_signed_in?) ? reset_cache_headers : expires_in(InRailsWeBlog.config.cache_time, public: true)
    if stale?(articles, template: false, public: true)
      respond_to do |format|
        format.html do
          articles = Article.serialized_json(articles,
                                             user_signed_in? ? 'normal' : 'sample',
                                             params: {
                                               current_user_id: current_user&.id
                                             },
                                             meta:   {
                                               storyTopic: article_params[:topic_slug].present? && articles.present? && articles.all?(&:story?) ? articles.first.topic.flat_serialized_json(with_model: false) : nil,
                                               **meta_attributes(pagination: articles)
                                             })

          render_associated_page(articles: articles)
        end
      end
    end
  end

  def show
    article, article_redirection = find_article_in_locales(article_params[:article_slug])
    admin_or_authorize article

    redirect_to(article_redirection, status: :moved_permanently) and return if article_redirection

    set_seo_data(:user_article,
                 article_slug:         article,
                 article_content_slug: article.summary_content(InRailsWeBlog.config.seo_meta_desc_length, remove_links: true),
                 topic_slug:           article.topic,
                 user_slug:            article.user,
                 author:               article.user.pseudo,
                 model:                article,
                 og:                   {
                                         type:  "#{ENV['WEBSITE_NAME']}:article",
                                         url:   article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                                         image: article.default_picture ? (root_url + article.default_picture) : nil
                                       }.compact)

    (user_signed_in? || admin_signed_in?) ? reset_cache_headers : expires_in(InRailsWeBlog.config.cache_time, public: true)
    if stale?(article, template: false, public: true) || article.user?(current_user)
      respond_to do |format|
        format.html do
          article = if current_user && article.user?(current_user)
                      article.serialized_json('complete',
                                              params: { current_user_id: current_user&.id },
                                              meta:   meta_attributes)
                    else
                      article.serialized_json('normal',
                                              meta: {
                                                      storyTopic: article.story? ? article.topic.flat_serialized_json(with_model: false) : nil,
                                                      **meta_attributes
                                                    }.compact)
                    end

          render_associated_page(article: article)
        end
      end
    end
  end

  def edit
    not_found_error and return unless current_user

    article = Article.include_element.friendly.find(article_params[:article_slug])
    admin_or_authorize article

    respond_to do |format|
      format.html do
        set_seo_data(:edit_article,
                     article_slug: article,
                     topic_slug:   article.topic,
                     user_slug:    article.user,
                     author:       article.user.pseudo)

        article = article.serialized_json('complete',
                                          params: {
                                            current_user_id: current_user.id
                                          },
                                          meta:   meta_attributes)

        render_associated_page(article: article)
      end
    end
  end

  private

  def article_params
    params.permit(:article_slug,
                  :user_slug,
                  :visibility,
                  :mode,
                  :draft,
                  :accepted,
                  :user_id,
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
                  :page,
                  :limit)
  end

  def find_article_in_locales(article_slug)
    article = @context_user.articles.find_slug_by_locale(article_slug, I18n.locale).first

    if article
      return article, nil
    else
      I18n.available_locales.map do |locale|
        next if locale == I18n.locale

        article = @context_user.articles.find_slug_by_locale(article_slug, locale).first

        if article
          article_redirection = article.link_path(locale: locale) rescue nil
          if article_redirection
            skip_authorization
            return article, article_redirection
          end
        end
      end

      @context_user.articles.friendly.find(params[:article_slug])
    end
  end

end
