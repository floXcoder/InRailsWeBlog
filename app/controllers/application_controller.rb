# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Security
  protect_from_forgery with: :exception

  # Handle exceptions
  rescue_from StandardError, with: :server_error
  rescue_from ActionController::RoutingError, with: :not_found_error
  rescue_from AbstractController::ActionNotFound, with: :not_found_error
  rescue_from ActionController::InvalidCrossOriginRequest, with: :not_found_error
  rescue_from ActionController::UnknownFormat, with: :not_found_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found_error

  # Pundit
  include Pundit
  rescue_from Pundit::NotDefinedError, with: :user_not_authorized
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :user_not_authorized

  # Error reporting
  before_action :set_raven_context

  # Devise
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Set locale for current user
  before_action :set_locale

  # Set who is responsible of a modification
  before_action :set_paper_trail_whodunnit

  # Set flash to headers if ajax request
  after_action :flash_to_headers

  def set_locale
    I18n.locale =
      if params[:locale].present?
        session[:locale] = params[:locale]
      elsif session[:locale].present?
        session[:locale]
      elsif defined?(current_user) && current_user
        current_user.locale
        # elsif request.location&.present? && !request.location.country_code.empty?
        #   if %w[FR BE CH].any? { |country_code| request.location.country_code.casecmp(country_code).zero? }
        #     :fr
        #   else
        #     :en
        #   end
        # elsif http_accept_language.compatible_language_from(I18n.available_locales)
        #   http_accept_language.compatible_language_from(I18n.available_locales)
      else
        :fr
      end

    if params[:new_lang] && current_user && current_user.locale.to_s != params[:new_lang]
      current_user.update_columns(locale: params[:new_lang])
    end

    # Set user location
    @user_latitude = (request.respond_to?(:location) ? request.location.latitude : 0) rescue 0
    @user_longitude = (request.respond_to?(:location) ? request.location.longitude : 0) rescue 0
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
          js_redirect_to(login_path)
        end
        format.html do
          store_current_location
          redirect_to login_path, notice: I18n.t('devise.failure.unauthenticated')
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
        format.html { render 'errors/show', locals: { status: 404 }, status: :not_found }
        format.all { render body: nil, status: :not_found }
      end
    end
  end

  # Do not save new version when auto-saving
  def paper_trail_enabled_for_controller
    super && !params[:auto_save]
  end

  protected

  # SEO
  def titleize(page_title)
    base_title = page_title
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?
    base_title += " - #{ENV['WEBSITE_NAME']}"

    base_title.html_safe
  end

  def titleize_admin(page_title)
    base_title = "(ADMIN) | #{page_title}"
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?
    base_title += " - #{ENV['WEBSITE_NAME']}"

    base_title.html_safe
  end

  def canonical_url(url)
    params = request.fullpath[/\?.*/]
    params ? url + params : url
  end

  def alternate_urls(path)
    params = request.fullpath[/\?.*/]
    if path.is_a?(Hash)
      if params
        path.each { |locale, url| path[locale] = url + params }
      else
        path
      end
    else
      Hash[I18n.available_locales.map { |locale| [locale.to_s, params ? send("#{path}_#{locale}_url") + params : send("#{path}_#{locale}_url")] }]
    end
  end

  def image_url(url)
    (Rails.env.production? ? "https://#{ENV['WEBSITE_ASSET']}/" : root_url) + 'assets/' + url
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
      user_params.permit(:pseudo, :email, :password, :password_confirmation)
    end
    devise_parameter_sanitizer.permit(:sign_in) do |user_params|
      user_params.permit(:login, :pseudo, :email, :password, :remember_me)
    end
    devise_parameter_sanitizer.permit(:account_update) do |user_params|
      user_params.permit(:pseudo, :email, :password)
    end
  end

  def previous_url(url)
    if url &&
      !url.include?('/users/sign_in') &&
      !url.include?('/login') &&
      !url.include?('admin/login') &&
      !url.include?('/users/sign_up') &&
      !url.include?('/signup') &&
      !url.include?('/users/password/new') &&
      !url.include?('/users/password/edit') &&
      !url.include?('/users/confirmation') &&
      !url.include?('/users/validation') &&
      !url.include?('/users/logout') &&
      !url.include?('/admin/logout') &&
      !url.include?('/users/sign_out') &&
      !url.include?('/admin/sign_out')
      return url
    end
  end

  def store_current_location
    store_location_for(:user, request.url) if request.get?
  end

  # Called after sign in and sign up
  def after_sign_in_path_for(resource_or_scope)
    session[:first_connection] = true

    if resource.is_a?(Admin)
      admin_path
    else
      root_path     = signed_in_root_path(resource_or_scope)
      previous_path = request.referer && URI.parse(request.referer).path

      if previous_path =~ /\/login/ || previous_path =~ /\/signup/
        root_path
      else
        request.env['omniauth.origin'] || stored_location_for(resource_or_scope) || previous_path || root_path
      end
    end
  end

  def after_sign_out_path_for(_resource)
    # previous_path = request.referer && URI.parse(request.referer).path
    # previous_path || root_path
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

  def get_coordinates_from_ip
    result         = request.location
    distance       = 100
    ip_coordinates = result.coordinates

    Geocoder::Calculations.bounding_box(ip_coordinates, distance) if ip_coordinates != [0, 0]
  end

  # Format meta data for active model serializer
  def meta_attributes(attributes = {})
    meta_data = {}

    if attributes[:pagination]
      meta_data.merge!(pagination: {
        current_page: attributes[:pagination].current_page,
        total_pages:  attributes[:pagination].total_pages,
        total_count:  attributes[:pagination].total_count
      })
    end

    if meta_tags&.meta_tags.present?
      meta_data.merge!(metaTags: meta_tags.meta_tags)
    end

    return meta_data
  end

  def honeypot_protection
    if (params[:ensure] && !params[:ensure][:validity].blank?) || !params[:ensure_validity].blank?
      respond_to do |format|
        format.json { render json: { success: true }.to_json, status: :ok }
        format.js { js_redirect_to(root_path) }
        format.html { head(200) }
      end
    end
  end

  def without_tracking(model)
    model.public_activity_off
    yield if block_given?
    model.public_activity_on
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
        flash[:error] = error_message
        redirect_to(ERB::Util.html_escape(request.referer) || root_path)
      end
    end
  end

  def not_found_error(_exception)
    raise if Rails.env.development?

    respond_to do |format|
      format.json { render json: { errors: t('views.error.status.explanation.404') }, status: :not_found }
      format.html { render 'errors/show', locals: { status: 404 }, status: :not_found }
      format.all { render body: nil, status: :not_found }
    end
  end

  def server_error(exception)
    Raven.capture_exception(exception) if Rails.env.production?

    raise if Rails.env.development?

    respond_to do |format|
      format.json { render json: { errors: t('views.error.status.explanation.500') }, status: :internal_server_error }
      format.html { render 'errors/show', locals: { status: 500 }, status: :internal_server_error }
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
