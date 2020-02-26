# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :verify_requested_format!

  respond_to :html, :text, :json

  def home
    respond_to do |format|
      format.html do
        expires_in InRailsWeBlog.config.cache_time, public: true

        if current_user
          if request.path == '/' && current_user.locale != 'en'
            redirect_to send("user_home_#{current_user.locale}_path")
          else
            set_seo_data(:user_home,
                         user_slug: current_user.pseudo,
                         og:        {
                           type:  "#{ENV['WEBSITE_NAME']}:home",
                           url:   root_url,
                           image: image_url('logos/favicon-192x192.png')
                         })

            render :user
          end
        else
          set_seo_data(:home,
                       og:        {
                         type:  "#{ENV['WEBSITE_NAME']}:home",
                         url:   root_url,
                         image: image_url('logos/favicon-192x192.png')
                       })

          render :home
        end
      end
    end
  end

  def not_found
    respond_to do |format|
      format.html do
        expires_in InRailsWeBlog.config.cache_time, public: true

        set_seo_data(:not_found)
        render :home, status: :not_found
      end
    end
  end

  # SEO
  def robots
    respond_to :text
  end

  def meta_tag
    parameters = params.to_unsafe_h.except(:controller, :action, :page, :locale, :format, :route_name, :force_locale).symbolize_keys
    set_seo_data(params[:route_name], parameters)

    render json: meta_attributes
  end

end
