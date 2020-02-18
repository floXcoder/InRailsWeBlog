# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :verify_requested_format!

  respond_to :html, :text, :json

  def home
    respond_to do |format|
      format.html do
        expires_in InRailsWeBlog.config.cache_time, public: true

        if current_user
          set_seo_data(:user_home,
                       user_slug: current_user.pseudo,
                       og:        {
                         type:  "#{ENV['WEBSITE_NAME']}:home",
                         url:   root_url,
                         image: image_url('logos/favicon-192x192.png')
                       })

          render :user
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
    set_seo_data(params[:route_name])

    render json: meta_attributes
  end

end
