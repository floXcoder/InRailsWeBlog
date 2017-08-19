class ApplicationController < ActionController::Base
  # Security
  protect_from_forgery with: :reset_session

  # Handle exceptions
  rescue_from StandardError, with: :server_error
  rescue_from ActionController::InvalidAuthenticityToken, with: :server_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found_error
  rescue_from ActionController::RoutingError, with: :not_found_error
  rescue_from AbstractController::ActionNotFound, with: :not_found_error
  rescue_from ActionController::UnknownController, with: :not_found_error
  rescue_from ActionController::UnknownFormat, with: :not_found_error

  # Pundit
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :user_not_authorized

  # Devise
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Set locale for current user
  before_action :set_locale

  # Set who is responsible of a modification
  before_action :set_paper_trail_whodunnit

  # Set flash to header if ajax request
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
    begin
      @user_latitude  = request.location.latitude
      @user_longitude = request.location.longitude
    rescue
      @user_latitude  = 0
      @user_longitude = 0
    end
  end

  # Redirection when Javascript is used.
  # +flash_type+ parameters:
  #  success
  #  error
  #  alert
  #  notice
  def js_redirect_to(path, flash_type = nil, flash_message = nil)
    if flash_type
      flash[flash_type] = flash_message
    end

    render js: %(window.location.href='#{path}') and return
  end

  def append_info_to_payload(payload)
    super
    payload[:request_id] = request.uuid
    payload[:user_id]    = current_user.id if current_user
    payload[:admin_id]   = current_admin.id if current_admin
  end

  protected

  # SEO
  def titleize(page_title)
    base_title = page_title
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?

    base_title.html_safe
  end

  def titleize_admin(page_title)
    base_title = "(ADMIN) | #{page_title}"
    base_title = "(#{Rails.env.capitalize}) | #{base_title}" unless Rails.env.production?

    base_title.html_safe
  end

  def user_canonical_url(slug)
    "#{root_url}users/#{slug}" + request.fullpath[/\?.*/].to_s
  end

  def topic_canonical_url(slug)
    "#{root_url}topics/#{slug}" + request.fullpath[/\?.*/].to_s
  end

  def article_canonical_url(slug)
    "#{root_url}articles/#{slug}" + request.fullpath[/\?.*/].to_s
  end

  def tag_canonical_url(slug)
    "#{root_url}tags/#{slug}" + request.fullpath[/\?.*/].to_s
  end

  def alternate_urls(route, slug = nil, options = {})
    if options[:parent_main_route] && options[:parent_route] && options[:parent_slug]
      Hash[I18n.available_locales.map { |local| [local.to_s, "#{root_url}#{local}/#{I18n.t('routes.' + options[:parent_route], locale: local)}/#{options[:parent_slug]}/#{I18n.t('routes.' + options[:parent_main_route], locale: local)}/#{I18n.t('routes.' + route, locale: local)}/#{slug}#{request.fullpath[/\?.*/]}"] }]
    elsif options[:parent_route] && options[:parent_slug]
      Hash[I18n.available_locales.map { |local| [local.to_s, "#{root_url}#{local}/#{I18n.t('routes.' + options[:parent_route], locale: local)}/#{options[:parent_slug]}/#{I18n.t('routes.' + route, locale: local)}/#{slug}#{request.fullpath[/\?.*/]}"] }]
    elsif route.empty?
      Hash[I18n.available_locales.map { |local| [local.to_s, "#{root_url}#{local}/#{request.fullpath[/\?.*/]}"] }]
    else
      Hash[I18n.available_locales.map { |local| [local.to_s, "#{root_url}#{local}/#{I18n.t('routes.' + route, locale: local)}/#{slug}#{request.fullpath[/\?.*/]}"] }]
    end
  end

  def image_url(url)
    root_url + 'assets/' + url
  end

  def handle_error(exception)
    # Add into database
    error_params = {
      class_name:  exception.class.to_s,
      message:     exception.to_s,
      trace:       exception.backtrace.join("\n"),
      target_url:  request.url,
      referer_url: request.referer,
      params:      request.params.inspect,
      user_agent:  request.user_agent,
      doc_root:    request.env['DOCUMENT_ROOT'],
      app_name:    Rails.application.class.parent_name,
      created_at:  Time.zone.now,
      origin:      ErrorMessage.origins[:server]
    }
    error        = ErrorMessage.new_error(error_params, request, current_user)
    error.save

    # Display in logger
    Rails.logger.fatal(exception.class.to_s + ' : ' + exception.to_s)
    Rails.logger.fatal(exception.backtrace.join("\n"))
  end

  def not_found_error(exception)
    handle_error(exception)

    raise if Rails.env.development?

    respond_to do |format|
      format.html { render 'errors/show', layout: 'full_page', locals: { status: 404 }, status: 404 }
      format.json { render json: { error: t('views.error.status.explanation.404'), status: :not_found } }
      format.all { render body: nil, status: :not_found }
    end
  end

  def server_error(exception)
    handle_error(exception)

    raise if Rails.env.development?

    respond_to do |format|
      format.html { render 'errors/show', layout: 'full_page', locals: { status: 500 }, status: 500 }
      format.json { render json: { error: t('views.error.status.explanation.500'), status: :internal_server_error } }
      format.all { render body: nil, status: :internal_server_error }
    end
  end

  def json_request?
    request.format.json?
  end

  # Prevent page caching for sensitive data
  def reset_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = 'Fri, 01 Jan 1990 00:00:00 GMT'
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit(:pseudo, :email, :password, :password_confirmation, :professional, :professional_type)
    end
    devise_parameter_sanitizer.permit(:sign_in) do |user_params|
      user_params.permit(:login, :pseudo, :email, :password, :remember_me)
    end
    devise_parameter_sanitizer.permit(:account_update) do |user_params|
      user_params.permit(:pseudo, :email, :password, :password_confirmation, :current_password)
    end
  end

  def user_not_authorized(exception)
    # Clear the previous response body to avoid a DoubleRenderError when redirecting or rendering another view
    self.response_body = nil

    if exception.respond_to?(:policy) && exception.respond_to?(:query)
      policy_name = exception.policy.class.to_s.underscore
      policy_type = exception.query

      flash[:alert] = t("#{policy_name}.#{policy_type}", scope: 'pundit', default: :default)
    else
      flash[:alert] = t('pundit.default')
    end

    respond_to do |format|
      format.js { js_redirect_to(ERB::Util.html_escape(request.referer) || root_path) }
      format.html { redirect_to(ERB::Util.html_escape(request.referer) || root_path) }
      format.json { render json: { error: I18n.t('pundit.default') }.to_json, status: :forbidden }
    end
  end

  def authenticate_user!(options = {})
    if admin_signed_in? && !user_signed_in?
      # TODO: create first user by default in seed
      sign_in(:user, User.first)
      super(options)
    elsif user_signed_in?
      super(options)
    else
      self.response_body = nil
      respond_to do |format|
        format.js do
          flash[:alert] = I18n.t('devise.failure.unauthenticated')
          js_redirect_to(login_path)
        end
        format.html do
          save_location
          redirect_to login_path, notice: I18n.t('devise.failure.unauthenticated')
        end
        format.json do
          flash.now[:alert] = I18n.t('devise.failure.unauthenticated')
          render json:   { error: I18n.t('devise.failure.unauthenticated') }.to_json,
                 status: :forbidden
        end
      end
    end
  end

  def authenticate_admin!(options = {})
    if admin_signed_in?
      super(options)
    else
      respond_to do |format|
        format.html { render 'errors/show', layout: 'full_page', locals: { status: 404 }, status: 404 }
        format.json { render json: { error: t('views.error.status.explanation.404'), status: 404 } }
        format.all { render body: nil, status: :not_found }
      end
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

  # Called after sign in and sign up
  def after_sign_in_path_for(_resource)
    session[:user_just_sign] = true

    previous_url = previous_url(request.referer)

    if !session[:previous_url] && request.referer && request.referer.include?(root_url) && previous_url
      session[:previous_url] = request.referer
    end

    root_path = resource.is_a?(Admin) ? admin_path : root_path(current_user)

    session[:previous_url] || root_path
  end

  def save_location
    return unless request.get?

    session[:previous_url] = previous_url(request.path) unless request.xhr? # don't store ajax calls
  end

  def admin_or_authorize(model = nil, method = nil)
    if current_admin
      skip_authorization
    else
      raise Pundit::NotAuthorizedError unless model
      authorize(model, method)
    end
  end

  def get_coordinates_from_IP
    result         = request.location
    distance       = 100
    ip_coordinates = result.coordinates

    if ip_coordinates != [0, 0]
      Geocoder::Calculations.bounding_box(ip_coordinates, distance)
    else
      nil
    end
  end

  # Add pagination for active model serializer
  def meta_attributes(resource, extra_meta = {})
    {
      current_page: resource.current_page,
      total_pages:  resource.total_pages,
      total_count:  resource.total_count
    }.merge(extra_meta)
  end

  def without_tracking(model)
    model.public_activity_off
    yield if block_given?
    model.public_activity_on
  end

  private

  def flash_to_headers
    if request.xhr? && !flash.empty? && response.status != 302
      # avoiding XSS injections via flash
      flash_json                           = Hash[flash.map { |k, v| [k, ERB::Util.h(v)] }].to_json
      response.headers['X-Flash-Messages'] = flash_json
      # flash.discard
    end
  end
end
