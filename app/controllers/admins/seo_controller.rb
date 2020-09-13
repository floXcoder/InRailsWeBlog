# frozen_string_literal: true

class Admins::SeoController < AdminsController
  before_action :verify_requested_format!

  respond_to :html, :json

  def index
    respond_to do |format|
      format.html do
        seo_pages = Seo::Data.local_named_routes

        set_meta_tags title:   titleize_admin(I18n.t('views.admin.seo.title')),
                      noindex: true, nofollow: true

        render :index, locals: { seo_pages: seo_pages.map(&:to_h).to_json }
      end

      format.json do
        locales_named_routes = Seo::Data.local_named_routes.map(&:name)
        seo_data             = Seo::Data.all.sort_by { |data| locales_named_routes.index(data.name) }

        render json: Seo::DataSerializer.new(seo_data,
                                             params: { routes: Seo::Data.local_named_routes },
                                             meta:   { root: 'seoData' }).serializable_hash
      end
    end
  end

  def retrieve_parameters
    name       = nil
    locale     = nil
    parameters = []
    url        = nil
    error      = nil

    if params[:route]
      route_parameters = Rails.application.routes.routes.find { |r| r.name == params[:route] }
      if parameters
        name       = params[:route]
        locale     = route_parameters.defaults[:locale].presence || I18n.default_locale
        parameters = route_parameters.parts - [:format]
        url = Rails.application.routes.url_helpers.send("#{name}_path", Hash[*(parameters.map { |p| [p, p] }.flatten)]) rescue nil
      else
        error = "Named route not found"
      end
    elsif params[:url]
      begin
        route_url = Rails.application.routes.recognize_path(params[:url], method: :get)
        if route_url[:controller] == 'pages' && route_url[:action] == 'home'
          name       = route_url[:name]
          locale     = route_url[:locale].presence || I18n.default_locale
          parameters = route_url.except(:controller, :action, :name).keys
        else
          error = "URL non définissable pour le SEO"
        end
      rescue ActionController::RoutingError
        error = "L'url n'est pas disponible sur le site"
      end
    end

    if error
      render json: { error: error }, status: :unprocessable_entity and return
    else
      parameters = parameters.map { |parameter| Seo::Data.associated_parameters[parameter] }.flatten.concat(parameters).compact.uniq

      render json: {
        name:       name,
        parameters: parameters,
        locale:     locale,
        url:        url
      }
    end
  end

  def create
    seo_data = Seo::Data.new(seo_params.merge(locale: seo_params[:locale] || I18n.locale, parameters: seo_params[:parameters].split(',')))

    respond_to do |format|
      format.json do
        if seo_data.save
          flash.now[:success] = t('views.admin.seo_data.flash.successful_creation')
          render json:   Seo::DataSerializer.new(seo_data).serializable_hash,
                 status: :created
        else
          flash.now[:error] = t('views.admin.seo_data.flash.error_creation')
          render json:   { errors: seo_data.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def update
    seo_data = Seo::Data.find(params[:id])

    respond_to do |format|
      format.json do
        if seo_data.update(seo_params.except(:locale, :name, :parameters))
          flash.now[:success] = t('views.admin.seo_data.flash.successful_edition')
          render json:   Seo::DataSerializer.new(seo_data).serializable_hash,
                 status: :ok
        else
          flash.now[:error] = t('views.admin.seo_data.flash.error_edition')
          render json:   { errors: seo_data.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    seo_data = Seo::Data.find(params[:id])

    respond_to do |format|
      if seo_data.destroy
        flash.now[:success] = t('views.admin.seo_data.flash.successful_deletion')
        format.json do
          render json:   { removed_id: seo_data.id },
                 status: :accepted
        end
      else
        flash.now[:error] = t('views.admin.seo_data.flash.error_deletion')
        format.json do
          render json:   { errors: seo_data.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def seo_params
    params.require(:seo_data).permit(:name,
                                     :locale,
                                     :parameters,
                                     :page_title,
                                     :meta_desc)
  end

end
