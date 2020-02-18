# frozen_string_literal: true

class Admins::SeoController < AdminsController
  def index
    respond_to do |format|
      format.html do
        seo_pages = Seo::Data.local_named_routes

        set_meta_tags title:   titleize_admin(I18n.t('views.admin.seo.title')),
                      noindex: true, nofollow: true

        render :index, locals: { seo_pages: seo_pages.to_json }
      end

      format.json do
        seo_data = Seo::Data.all

        render json: Seo::DataSerializer.new(seo_data,
                                             meta: { root: 'seoData' })
      end
    end
  end

  def retrieve_parameters
    name       = nil
    parameters = []
    error      = nil

    if params[:url]
      begin
        route_url = Rails.application.routes.recognize_path(params[:url], method: :get)
        if route_url[:controller] == 'pages' && route_url[:action] == 'home'
          name       = route_url[:name]
          parameters = route_url.except(:controller, :action, :name).keys
        else
          error = "URL non définissable pour le SEO"
        end
      rescue ActionController::RoutingError
        error = "L'url n'est pas disponible sur le site"
      end
    elsif params[:route]
      parameters = Rails.application.routes.routes.find { |r| r.name == params[:route] }
      if parameters
        name       = params[:route]
        parameters = parameters.parts - [:format]
      else
        error = "Named route not found"
      end
    end

    if error
      render json: { error: error }, status: :unprocessable_entity and return
    else
      parameters = parameters.map { |parameter| Seo::Data.associated_parameters[parameter] }.flatten.concat(parameters).compact.uniq

      render json: {
        name:       name,
        parameters: parameters
      }
    end
  end

  def create
    seo_data = Seo::Data.new(seo_params.merge(locale: seo_params[:locale] || I18n.locale, parameters: seo_params[:parameters].split(',')))

    respond_to do |format|
      format.json do
        if seo_data.save
          flash.now[:success] = t('views.admin.seo_data.flash.successful_creation')
          render json:   Seo::DataSerializer.new(seo_data),
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
        if seo_data.update(seo_params.except(:local, :name, :parameters))
          flash.now[:success] = t('views.admin.seo_data.flash.successful_edition')
          render json:   Seo::DataSerializer.new(seo_data),
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
