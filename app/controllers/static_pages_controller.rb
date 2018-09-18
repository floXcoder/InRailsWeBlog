# frozen_string_literal: true

class StaticPagesController < ApplicationController
  before_action :verify_requested_format!

  respond_to :html, :text

  def home
    respond_to do |format|
      format.html do
        expires_in CONFIG.cache_time, public: true
        set_meta_tags title:       titleize(I18n.t('views.home.title')),
                      description: I18n.t('views.home.description'),
                      canonical:   canonical_url(root_url),
                      alternate:   {
                        fr: canonical_url(root_url),
                        en: canonical_url(root_url)
                      },
                      og:          {
                        type:  "#{ENV['WEBSITE_NAME']}:home",
                        url:   root_url,
                        # image: image_url('logos/favicon-192x192.png')
                      }
        render :home
      end
    end
  end

  # SEO
  def robots
    respond_to :text
  end

end
