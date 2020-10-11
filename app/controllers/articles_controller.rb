# frozen_string_literal: true

class ArticlesController < ApplicationController
  before_action :set_context_user, only: [:show]

  after_action :verify_authorized, only: [:show, :edit]

  respond_to :html

  def index
    if params[:topic_slug].present?
      set_seo_data(:topic_articles,
                   topic_slug: params[:topic_slug],
                   user_slug:  params[:user_slug])
    elsif params[:tag_slug].present? || params[:parent_tag_slug].present?
      set_seo_data(:tagged_articles,
                   tag_slug: params[:parent_tag_slug].presence || params[:tag_slug].presence)
    elsif params[:user_slug].present?
      set_seo_data(:user_articles,
                   user_slug: params[:user_slug])
    end

    articles = ::Articles::FindQueries.new(current_user, current_admin).all(params.to_unsafe_h.merge(page: params[:page], limit: params[:limit]))

    expires_in(InRailsWeBlog.config.cache_time, public: true)
    if stale?(articles, template: false, public: true)
      respond_to do |format|
        format.html do
          articles = Article.serialized_json(articles, meta: {
            storyTopic: params[:topic_slug].present? && articles.present? && articles.all?(&:story?) ? articles.first.topic.flat_serialized_json(with_model: false) : nil,
            **meta_attributes(pagination: articles)
          })

          render_associated_page(articles: articles)
        end
      end
    end
  end

  def show
    article = @context_user.articles.friendly.find(params[:article_slug])
    admin_or_authorize article

    set_seo_data(:user_article,
                 article_slug:         article,
                 article_content_slug: article.content.summary(InRailsWeBlog.config.seo_meta_desc_length),
                 topic_slug:           article.topic,
                 user_slug:            article.user,
                 author:               article.user.pseudo,
                 model:                article,
                 og:                   {
                                         type:  "#{ENV['WEBSITE_NAME']}:article",
                                         url:   article.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                                         image: article.default_picture ? (root_url + article.default_picture) : nil
                                       }.compact)

    expires_in(InRailsWeBlog.config.cache_time, public: true)
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

    article = current_user.articles.include_element.friendly.find(params[:article_slug])
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

end
