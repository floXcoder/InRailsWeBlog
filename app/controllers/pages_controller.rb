# frozen_string_literal: true

class PagesController < ApplicationController
  skip_before_action :track_ahoy_visit, only: [:meta_tag, :feed, :open_search, :robots]

  before_action :authenticate_user!, only: [:user_home]

  respond_to :html, :json, :rss, :text, :xml

  def home
    track_action

    reset_cache_headers
    respond_to do |format|
      format.html do
        set_seo_data(:home,
                     og: {
                       type:  "#{ENV['WEBSITE_NAME']}:home",
                       url:   root_url,
                       image: image_url('logos/favicon-192x192.png')
                     })

        render_associated_page
      end
    end
  end

  def user_home
    user_ref = params[:user_slug].presence || params[:user_id].presence || params[:id]
    user     = current_user&.id == user_ref&.to_i || current_user&.slug == user_ref&.to_s ? current_user : User.friendly.find(user_ref)
    authorize user, :show?

    track_action(user_id: user.id)

    reset_cache_headers
    respond_to do |format|
      format.html do
        if request.path == '/' && user.locale != 'en'
          redirect_to send(:"user_home_#{user.locale}_path", user_slug: user.slug)
        end

        set_seo_data(:user_home,
                     user_slug: user,
                     og:        {
                       type:  "#{ENV['WEBSITE_NAME']}:home",
                       url:   root_url,
                       image: image_url('logos/favicon-192x192.png')
                     })

        render_associated_page
      end
    end
  end

  def about
    track_action

    expires_in(InRailsWeBlog.settings.cache_time, public: true)
    respond_to do |format|
      format.html do
        set_seo_data(:about)

        render_associated_page(page: 'about')
      end
    end
  end

  def terms
    track_action

    expires_in(InRailsWeBlog.settings.cache_time, public: true)
    respond_to do |format|
      format.html do
        set_seo_data(:terms)

        render_associated_page(page: 'terms')
      end
    end
  end

  def privacy
    track_action

    expires_in(InRailsWeBlog.settings.cache_time, public: true)
    respond_to do |format|
      format.html do
        set_seo_data(:privacy)

        render_associated_page(page: 'privacy')
      end
    end
  end

  def not_found
    # Do not track not found pages in visits, use log instead
    # track_action(status: 404)

    respond_to do |format|
      format.json do
        Rails.logger.error("Page not found: #{request.path}") if Rails.env.production?

        render json: { errors: t('views.error.status.explanation.404') }, status: :not_found
      end
      format.html do
        expires_in(InRailsWeBlog.settings.cache_time, public: true)

        set_seo_data(:not_found)
        render_associated_page(status: :not_found)
      end
      format.all { render body: nil, status: :not_found }
    end
  end

  def meta_tag
    parameters = params.to_unsafe_h.except(:controller, :action, :page, :locale, :format, :route_name, :force_locale).symbolize_keys
    set_seo_data(params[:route_name], parameters)

    respond_to do |format|
      format.json { render json: meta_attributes }
    end
  end

  def feed
    locale = ensure_locale_params(params[:locale]) || I18n.locale

    articles = ::Articles::FindQueries.new(nil, nil).all(limit: 100)

    home_data = Seo::Data.find_by(name: "home_#{locale}")

    respond_to do |format|
      format.rss { render layout: false, locals: { locale: locale, home_data: home_data, articles: articles } }
    end
  end

  def manifest
    @start_path = current_user ? send(:"user_home_#{current_user.locale}_path", user_slug: current_user.slug) : '/'

    respond_to :json
  end

  def open_search
    respond_to :xml
  end

  def assetlinks
    respond_to :json
  end

  def traffic_advice
    respond_to do |format|
      format.all do
        render json: '[{"user_agent": "prefetch-proxy", "google_prefetch_proxy_eap": {"fraction": 1.0}}]', layout: false
      end
    end
  end

  def sitemap
    file = Rails.root.join("public/sitemaps/#{I18n.locale}/sitemap.xml.gz").read

    file = ActiveSupport::Gzip.decompress(file) if request.format.xml?

    respond_to do |format|
      format.xml do
        send_data(file)
      end
      format.gzip do
        send_data(file)
      end
    end
  end

  def robots
    respond_to :text
  end

end
