# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :verify_requested_format!

  respond_to :html, :text

  def home
    respond_to do |format|
      format.html do
        expires_in InRailsWeBlog.config.cache_time, public: true

        if current_user
          set_seo_data(:user_home,
                       user_slug: current_user.pseudo,
                       canonical: canonical_url(root_url),
                       og:        {
                         type:  "#{ENV['WEBSITE_NAME']}:home",
                         url:   root_url,
                         image: image_url('logos/favicon-192x192.png')
                       })

          render :user
        else
          set_seo_data(:home,
                       canonical: canonical_url(root_url),
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

  # SEO
  def robots
    respond_to :text
  end

end
