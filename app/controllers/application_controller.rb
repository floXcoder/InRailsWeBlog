class ApplicationController < ActionController::Base
  # Security
  protect_from_forgery with: :exception

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
    I18n.locale         =
      if params[:locale].present?
        session[:locale] = params[:locale]
      elsif session[:locale].present?
        session[:locale]
      elsif defined?(current_user) && current_user
        current_user.locale
      elsif http_accept_language.compatible_language_from(I18n.available_locales)
        http_accept_language.compatible_language_from(I18n.available_locales)
      elsif request.location&.present? && !request.location.country_code.empty?
        if %w(FR BE CH).any? { |country_code| request.location.country_code.casecmp(country_code) == 0 }
          :fr
        else
          :en
        end
      else
        :fr
      end

    current_user.locale = I18n.locale if current_user && current_user.locale.to_s != I18n.locale.to_s

    # Set user location
    @user_latitude      = request.location.latitude
    @user_longitude     = request.location.longitude
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
    payload[:user_id] = current_user.id if current_user
    payload[:admin_id] = current_user.id if current_user&.admin?
  end

  protected

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
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit :pseudo, :email, :password, :password_confirmation
    end
    devise_parameter_sanitizer.permit(:sign_in) do |u|
      u.permit(:login, :pseudo, :email, :password, :remember_me)
    end
    devise_parameter_sanitizer.permit(:account_update) do |u|
      u.permit(:pseudo, :email, :password, :password_confirmation, :current_password)
    end
  end

  def user_not_authorized(exception)
    # Clear the previous response body to avoid a DoubleRenderError when redirecting or rendering another view
    self.response_body = nil

    if exception.respond_to?(:policy) && exception.respond_to?(:query)
      policy_name = exception.policy.class.to_s.underscore
      policy_type = exception.query

      flash.now[:alert] = t("#{policy_name}.#{policy_type}", scope: 'pundit', default: :default)
    else
      flash.now[:alert] = t('pundit.default')
    end

    respond_to do |format|
      format.js { js_redirect_to(ERB::Util.html_escape(request.referrer) || root_path) }
      format.html { redirect_to(ERB::Util.html_escape(request.referrer) || root_path) }
      format.json { render json: { error: I18n.t('pundit.default') }.to_json, status: :forbidden }
    end
  end

  def authenticate_user!(options = {})
    if user_signed_in?
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
          render json: { error: I18n.t('devise.failure.unauthenticated') }.to_json,
                 status: :forbidden
        end
      end
    end
  end

  def previous_url(url)
    if url &&
      !url.include?('/users/sign_in') &&
      !url.include?('/login') &&
      !url.include?('/users/sign_up') &&
      !url.include?('/signup') &&
      !url.include?('/users/password/new') &&
      !url.include?('/users/password/edit') &&
      !url.include?('/users/confirmation') &&
      !url.include?('/users/validation') &&
      !url.include?('/users/logout') &&
      !url.include?('/users/sign_out')
      return url
    end
  end

  def after_sign_in_path_for(_resource)
    previous_url = previous_url(request.referrer)

    if !session[:previous_url] && request.referrer && request.referrer.include?(root_url) && previous_url
      session[:previous_url] = request.referrer
    end

    session[:previous_url] || root_path(current_user)
  end

  def save_location
    return unless request.get?

    session[:previous_url] = previous_url(request.path) unless request.xhr? # don't store ajax calls
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
      total_pages: resource.total_pages,
      total_count: resource.total_count
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
