# frozen_string_literal: true

module Users
  class EnvironmentService < BaseService
    def initialize(session, cookies, browser_language, *args)
      super(*args)

      @session          = session
      @cookies          = cookies
      @browser_language = browser_language
    end

    def perform
      locale = resolve_locale

      return success(locale: locale)
    end

    private

    def resolve_locale
      new_locale = @params[:force_locale] ||
        @params[:locale] ||
        # locale_cookie ||
        @current_user&.locale ||
        @params[:default_locale] ||
        locale_session ||
        # locale_from_browser ||
        I18n.default_locale

      if @current_user && (@params[:force_locale].presence || @params[:locale].presence)
        # new_locale = current_customer.locale if request.referrer && !request.referrer&.include?(request.host)
        @current_user.update_attribute(:locale, new_locale.to_s) if @current_user.locale != new_locale
      end

      # Save locale into session for API requests
      if (@params[:locale].presence || @params[:default_locale].presence) && !@current_user
        @session[:locale] = @params[:locale].presence || @params[:default_locale]
      end

      # if @current_admin
      #   # new_locale = current_seller.locale if request.referrer && !request.referrer&.include?(request.host)
      #   @current_admin.update_attribute(:locale, new_locale.to_s) if @current_admin.locale != new_locale
      # end

      return new_locale
    end

    def locale_from_browser
      case @browser_language.user_preferred_languages.first
      when 'fr', 'fr-FR', 'fr-BE', 'fr-CH', 'fr-CA'
        'fr'
      when 'en', 'en-CA', 'en-GB', 'en-US'
        'en'
      else
        'en'
      end
    end

    def locale_session
      @session[:locale].presence
    end

    # def locale_cookie
    #   @cookies[:locale].present? && RouteTranslator.available_locales.include?(@cookies[:locale].to_sym) ? @cookies[:locale] : nil
    # end

  end
end
