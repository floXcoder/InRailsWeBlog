# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include CacheService

  # Security
  protect_from_forgery with: :exception, except: [:not_found, :not_found_error, :server_error]

  # Handle exceptions
  rescue_from StandardError, with: :server_error
  rescue_from NameError, with: :server_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found_error
  rescue_from ActionController::RoutingError, with: :not_found_error
  rescue_from AbstractController::ActionNotFound, with: :not_found_error
  rescue_from ActionController::InvalidCrossOriginRequest, with: :not_found_error
  rescue_from ActionController::UnknownFormat, with: :not_found_error

  # Pundit
  include Pundit
  rescue_from Pundit::NotDefinedError, with: :user_not_authorized
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :user_not_authorized

  # Set SEO mode
  prepend_before_action :check_seo_mode, if: -> { request.get? && request.format.html? }

  # Error reporting
  before_action :set_raven_context

  # Devise
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Set locale for current user
  before_action :set_locale

  # Reset headers if admin is connected
  before_action :reset_headers_for_admins

  # Set who is responsible of a modification
  before_action :set_paper_trail_whodunnit

  # Set flash to headers if ajax request
  after_action :flash_to_headers

  def set_locale
    user_env = ::Users::EnvironmentService.new(session,
                                               cookies,
                                               http_accept_language,
                                               locale:         params[:locale],
                                               force_locale:   params[:force_locale],
                                               default_locale: request.path == '/' ? 'en' : nil,
                                               current_user:   current_user).perform

    I18n.locale = user_env.result[:locale]
  end

  def check_seo_mode
    @seo_mode = ENV['SEO_CACHE'].to_s == 'true' && (params.key?(SeoCache.prerender_url_param) || params.key?(SeoCache.force_cache_url_param))
  end

  def reset_headers_for_admins
    reset_cache_headers if admin_signed_in?
  end

  # Redirection when Javascript is used.
  # +flash_type+ parameters:
  #  success
  #  error
  #  alert
  #  notice
  def js_redirect_to(path, flash_type = nil, flash_message = nil)
    flash[flash_type] = flash_message if flash_type

    render js: %(window.location.href='#{path}') && return
  end

  def append_info_to_payload(payload)
    return if request.params['action'] == 'viewed' || request.params['action'] == 'clicked'

    super

    payload[:request_id] = request.uuid
    payload[:referer]    = request.referer
    payload[:user_id]    = current_user.id if current_user
    payload[:admin_id]   = current_admin.id if current_admin
  end

  def authenticate_user!(options = {})
    if admin_signed_in? && !user_signed_in?
      sign_in(:user, User.first)
      super(options)
    elsif user_signed_in?
      super(options)
    else
      self.response_body = nil
      respond_to do |format|
        format.json do
          flash.now[:alert] = I18n.t('devise.failure.unauthenticated')
          render json:   { errors: I18n.t('devise.failure.unauthenticated') }.to_json,
                 status: :forbidden
        end
        format.js do
          flash[:alert] = I18n.t('devise.failure.unauthenticated')
          js_redirect_to(root_path)
        end
        format.html do
          store_current_location
          redirect_to root_path, notice: I18n.t('devise.failure.unauthenticated')
        end
      end
    end
  end

  def authenticate_admin!(options = {})
    if admin_signed_in?
      super(options)
    else
      respond_to do |format|
        format.json { render json: { errors: t('views.error.status.explanation.404') }, status: :not_found }
        format.html { render 'pages/default', locals: { status: 404 }, status: :not_found }
        format.all { render body: nil, status: :not_found }
      end
    end
  end

  protected

  def render_associated_page(page: nil, **params)
    params = current_user ? params.merge(current_user: current_user.serialized_json('profile')) : params

    if current_user
      render page || 'pages/user', locals: { **params }, layout: 'user'
    else
      render page || 'pages/default', locals: { **params }
    end
  end

  def set_context_user
    user_ref = params[:user_id].presence || params[:user_slug].presence

    @context_user ||= if user_ref
                        (current_user&.id == user_ref.to_i || current_user&.slug == user_ref.to_s) ? current_user : User.friendly.find(user_ref)
                      else
                        current_user
                      end

    raise ActiveRecord::RecordNotFound unless @context_user
  end

  # SEO
  def set_seo_data(named_route, parameters = {})
    current_locale = params[:force_locale] || params[:locale] || I18n.locale
    model          = parameters.delete(:model)
    canonical      = parameters.delete(:canonical)
    alternate      = parameters.delete(:alternate)
    author         = parameters.delete(:author)
    og             = parameters.delete(:og)

    seo_data = Rails.cache.fetch("seo-#{named_route}_#{current_locale}", expires_in: 1.week) do
      Seo::Data.find_by(
        #locale: current_locale,
        name: "#{named_route}_#{current_locale}"
      )
    end

    named_parameters = Seo::Data.named_parameters(parameters)
    slug_parameters  = Seo::Data.slug_parameters(parameters)

    if seo_data
      page_title = Seo::Data.convert_parameters(seo_data.page_title, named_parameters)
      meta_desc  = Seo::Data.convert_parameters(seo_data.meta_desc, named_parameters)
    else
      page_title = I18n.t('seo.default.page_title', website: ENV['WEBSITE_NAME'])
      meta_desc  = I18n.t('seo.default.meta_desc', website: ENV['WEBSITE_NAME'])
    end

    canonical = canonical_url(named_route, model, current_locale, slug_parameters) unless canonical
    alternate = alternate_urls(named_route, model, slug_parameters) unless alternate

    set_meta_tags(title:       titleize(page_title),
                  description: meta_desc,
                  canonical:   canonical,
                  alternate:   alternate,
                  author:      author,
                  og:          og)
  end

  def canonical_url(named_route, model, locale = I18n.locale, **params)
    locale = locale || 'en'
    host   = Rails.env.development? ? nil : ENV['WEBSITE_FULL_ADDRESS']

    if model
      model.link_path(locale: locale, route_name: named_route, host: host).gsub(/\/$/, '')
    else
      Rails.application.routes.url_helpers.send("#{named_route}_#{locale}_#{host ? 'url' : 'path'}", **(params.transform_values { |v| v.to_s.downcase.strip.tr('&', 'and').tr('_', '-').parameterize }).merge(host: host)).gsub(/(.*+)\/$/, '')
    end
  end

  def alternate_urls(named_route, model, **params)
    Hash[I18n.available_locales.map { |locale| [locale.to_s, canonical_url(named_route, model, locale, params)] }]
      .merge('x-default': canonical_url(named_route, model, 'en', params))
  end

  def image_url(url)
    ("#{Rails.env.production? ? 'https' : 'http'}://#{ENV['WEBSITE_ASSET']}/") + 'assets/' + url
  end

  def titleize(page_title)
    base_title = page_title
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?
    base_title += " | #{ENV['WEBSITE_NAME']}"

    base_title.html_safe
  end

  def titleize_admin(page_title)
    base_title = "(ADMIN) | #{page_title}"
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?
    base_title += " | #{ENV['WEBSITE_NAME']}"

    base_title.html_safe
  end

  def js_request?
    request.format.js?
  end

  def json_request?
    request.format.json?
  end

  # Prevent page caching for sensitive data
  def reset_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
    response.headers['Pragma']        = 'no-cache'
    response.headers['Expires']       = 'Fri, 01 Jan 1990 00:00:00 GMT'
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit(:pseudo, :email, :password, :password_confirmation, :locale)
    end
    devise_parameter_sanitizer.permit(:sign_in) do |user_params|
      user_params.permit(:login, :pseudo, :email, :password, :remember_me, :locale)
    end
    devise_parameter_sanitizer.permit(:account_update) do |user_params|
      user_params.permit(:pseudo, :email, :password)
    end
  end

  def store_current_location
    store_location_for(:user, request.url) if request.get? && request.format.html?
  end

  # Called after sign in and sign up
  def after_sign_in_path_for(resource_or_scope)
    if resource.is_a?(Admin)
      admins_path
    else
      user_root_path = send("user_home_#{resource_or_scope.locale || 'en'}_path", user_slug: resource_or_scope.slug)
      previous_path  = request.env['omniauth.origin'] || stored_location_for(resource_or_scope) || request.referer && URI.parse(request.referer).path

      if previous_path =~ /\/login/ || previous_path =~ /\/signup/ || previous_path == '/'
        user_root_path
      else
        previous_path || user_root_path
      end
    end
  end

  def after_inactive_sign_up_path_for(_resource)
    # login_path
    root_path
  end

  def after_update_path_for(_resource)
    # user_path(resource)
    root_path
  end

  def after_sign_out_path_for(_resource)
    # previous_path = request.referer && URI.parse(request.referer).path
    # previous_path || root_path
    root_path
  end

  def after_confirmation_path_for(_resource_name, _resource)
    root_path
  end

  def new_session_path(_resource)
    root_path
  end

  def after_failure_path
    # login_path
    root_path
  end

  def admin_or_authorize(model = nil, method = nil)
    if current_admin
      skip_authorization
    else
      raise Pundit::NotAuthorizedError unless model

      authorize(model, method)
    end
  end

  # Format meta data for active model serializer
  def meta_attributes(attributes = {})
    meta_data              = {}

    meta_data[:pagination] = {
      currentPage: attributes[:pagination].current_page,
      totalPages:  attributes[:pagination].total_pages,
      totalCount:  attributes[:pagination].total_count
    } if attributes[:pagination]

    meta_data[:metaTags]   = meta_tags.meta_tags if meta_tags&.meta_tags.present?

    return meta_data
  end

  def honeypot_protection
    if params.dig(:ensure, :validity).present? || params[:ensure_validity].present?
      respond_to do |format|
        format.json { render json: { success: true }.to_json, status: :ok }
        format.js { js_redirect_to(root_path) }
        format.html { head(200) }
      end
    end
  end

  def track_action(action: 'page_visit', **params, &block)
    return if @seo_mode

    ahoy.track action, tracking_params(params)

    if current_visit && request.get? && (request.format.html? || request.format.json?)
      current_visit.update(takeoff_page: request.url, ended_at: Time.zone.now, pages_count: current_visit.pages_count + 1)

      block.call(current_visit.visitor_token) if block_given? && block
    end
  end

  def tracking_params(params = {})
    {
      path:  (request.url.end_with?('/404') ? request.env['REQUEST_URI'] : request.url),
      error: request.url.end_with?('/404') ? '404' : nil
    }
      .merge(params)
      .compact
  end

  def format_tracking(data, limit_for_others = 12)
    formatted_data = data.map { |key, val| { key => val.count } }.reduce({}, :merge).sort_by { |_k, v| -v }

    if formatted_data.empty? || (formatted_data.size == 1 && formatted_data[0][0].nil?)
      nil
    else
      internal_indexes = formatted_data.each_index.select { |i| formatted_data[i][0]&.downcase&.include?(ENV['WEBSITE_ADDRESS'].sub('www.', '')) }
      if internal_indexes.present?
        internal_data    = ['internal', 0]
        internal_data[1] = internal_indexes.reduce(0) { |sr, i| sr + formatted_data[i][1] }
        internal_indexes.each_with_index { |index, i| formatted_data.delete_at(index - i) }
        formatted_data << internal_data
      end

      if formatted_data.size > limit_for_others
        others_count   = formatted_data[limit_for_others + 1..].reduce(0) { |sr, count| sr + count[1] }
        formatted_data = formatted_data[0..limit_for_others]
        formatted_data << ['others', others_count]
      end

      nil_indexes = formatted_data.each_index.select { |i| formatted_data[i][0].blank? }
      if nil_indexes.present?
        nil_data    = [nil, 0]
        nil_data[1] = nil_indexes.reduce(0) { |sr, i| sr + formatted_data[i][1] }
        nil_indexes.each_with_index { |index, i| formatted_data.delete_at(index - i) }
        formatted_data << nil_data
      end

      formatted_data = formatted_data.to_h
    end

    return formatted_data
  end

  def user_not_authorized(exception)
    # Clear the previous response body to avoid a DoubleRenderError when redirecting or rendering another view
    self.response_body = nil
    @_response_body    = nil

    error_message = if exception.respond_to?(:policy) && exception.respond_to?(:query)
                      policy_name = exception.policy.class.to_s.underscore
                      policy_type = exception.query

                      t("#{policy_name}.#{policy_type}", scope: 'pundit', default: :default)
                    else
                      t('pundit.default')
                    end

    respond_to do |format|
      format.json { render json: { errors: error_message }.to_json, status: :forbidden }
      format.js { js_redirect_to(ERB::Util.html_escape(request.referer) || root_path) }
      format.html do
        store_current_location
        flash[:error] = error_message
        redirect_to(ERB::Util.html_escape(request.referer) || root_path)
      end
    end
  end

  def not_found_error(exception = nil)
    raise if Rails.env.development?

    respond_to do |format|
      format.json { render json: { errors: t('views.error.status.explanation.404'), details: exception&.try(:message) }, status: :not_found }
      format.html { render 'pages/default', locals: { status: 404 }, status: :not_found }
      format.all { render body: nil, status: :not_found }
    end
  end

  def server_error(exception)
    if Rails.env.production?
      Raven.capture_exception(exception)
    else
      raise
    end

    respond_to do |format|
      format.json { render json: { errors: t('views.error.status.explanation.500'), details: exception&.try(:message) }, status: :internal_server_error }
      format.html { render 'pages/default', locals: { status: 500 }, status: :internal_server_error }
      format.all { render body: nil, status: :internal_server_error }
    end
  end

  private

  def set_raven_context
    if Rails.env.production? && ENV['SENTRY_RAILS_KEY']
      Raven.user_context(
        id:         current_user&.id.to_s,
        email:      current_user&.email,
        first_name: current_user&.first_name,
        last_name:  current_user&.last_name,
        topic_id:   current_user&.current_topic_id,
        ip_address: request.ip
      )

      Raven.tags_context(
        language: I18n.locale
      )

      Raven.extra_context(params: params.to_unsafe_h, url: request.url)
    end
  end

  def flash_to_headers
    return if !json_request? || flash.empty? || response.status == 302

    # avoiding XSS injections via flash
    flash_json                           = Hash[flash.map { |k, v| [k, ERB::Util.h(v)] }].to_json
    response.headers['X-Flash-Messages'] = flash_json
    # flash.discard
  end

end
