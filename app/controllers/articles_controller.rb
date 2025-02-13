# frozen_string_literal: true

class ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:edit]

  before_action :set_context_user, only: [:show]

  after_action :verify_authorized, only: [:show, :edit]

  include TrackerConcern

  respond_to :html

  def index
    articles            = Articles::FindQueries.new(current_user, current_admin).all(article_params)
    context_topic       = nil
    available_languages = nil

    languages           = articles.map(&:languages).flatten.uniq
    available_languages = Articles::FindQueries.new(current_user, current_admin).available_languages(article_params) if articles.blank?
    if article_params[:tag_slug].present? || article_params[:parent_tag_slug].present?
      if article_params[:topic_slug].present?
        set_seo_data(:tagged_topic_articles,
                     tag_slug:            article_params[:parent_tag_slug].presence || article_params[:tag_slug].presence,
                     topic_slug:          article_params[:topic_slug],
                     user_slug:           article_params[:user_slug],
                     languages:           languages,
                     available_languages: available_languages)
      else
        set_seo_data(:tagged_articles,
                     tag_slug:            article_params[:parent_tag_slug].presence || article_params[:tag_slug].presence,
                     languages:           languages,
                     available_languages: available_languages)
      end
    elsif article_params[:topic_slug].present?
      context_topic = articles.first&.topic
      set_seo_data(:topic_articles,
                   topic_slug:          article_params[:topic_slug],
                   user_slug:           article_params[:user_slug],
                   topic_content:       context_topic&.description&.summary(InRailsWeBlog.settings.seo_meta_desc_length, strip_html: true, remove_links: true),
                   exclude_slugs:       [:topic_content],
                   languages:           languages,
                   available_languages: available_languages)
    elsif article_params[:user_slug].present?
      set_seo_data(:user_articles,
                   user_slug:           article_params[:user_slug],
                   languages:           languages,
                   available_languages: available_languages)
    end

    track_action(article_ids: articles.map(&:id), tag_slug: article_params[:tag_slug], topic_slug: article_params[:topic_slug], user_slug: article_params[:user_slug])

    with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
    if !with_cache? || stale?(articles, template: false, public: true)
      respond_to do |format|
        format.html do
          articles = Article.serialized_json(articles,
                                             user_signed_in? ? 'normal' : 'sample',
                                             params: {
                                               current_user_id: current_user&.id
                                             },
                                             meta:   {
                                               storyTopic: context_topic&.stories? ? context_topic.flat_serialized_json(with_model: false) : nil,
                                               **meta_attributes(pagination: articles)
                                             })

          render_associated_page(articles: articles)
        end
      end
    end
  end

  def show
    article, article_redirection_path = find_article_in_locales(article_params[:article_slug])
    admin_or_authorize article

    # Redirect to the correct localized article or the renamed article
    redirect_to(article_redirection_path, status: :moved_permanently) and return if article_redirection_path

    track_action(article_id: article.id, topic_id: article.topic_id) { track_visit(Article, article.id, current_user&.id, article.topic_id) }

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

    with_cache?(article) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
    if !with_cache?(article) || stale?(article, template: false, public: true)
      respond_to do |format|
        format.html do
          article = if current_user && article.user?(current_user)
                      article.serialized_json('complete',
                                              params: { current_user_id: current_user&.id },
                                              meta:   {
                                                **meta_attributes
                                              })
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

    track_action(action: 'article_edit', article_id: article.id, topic_id: article.topic_id)

    respond_to do |format|
      format.html do
        set_seo_data(:edit_article,
                     article_slug: article,
                     topic_slug:   article.topic,
                     user_slug:    article.user,
                     author:       article.user.pseudo,
                     model:        article)

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
    if (article = @context_user.articles.find_slug_by_locale(article_slug, I18n.locale).first)
      return article, nil
    elsif (article_redirection = Article::Redirection.where(previous_slug: article_slug).first)
      # Try to find in listed redirections
      article = article_redirection.article
      article_redirection_path = article.link_path(locale: I18n.locale, force_locale: true) rescue nil

      return article, article_redirection_path
    else
      # Try to find article in other locales
      I18n.available_locales.map do |locale|
        next if locale == I18n.locale

        article = @context_user.articles.find_slug_by_locale(article_slug, locale).first
        next unless article

        article_redirection_path = article.link_path(locale: locale) rescue nil
        next unless article_redirection_path

        skip_authorization

        return article, article_redirection_path
      end
    end

    # Article not found: raise a 404 error
    @context_user.articles.friendly.find(params[:article_slug])
  end

end
