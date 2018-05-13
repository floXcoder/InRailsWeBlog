class StaticPagesController < ApplicationController
  before_action :verify_requested_format!

  respond_to :html, :text

  def home
    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.home.title')),
                      description: I18n.t('views.home.description'),
                      canonical:   canonical_url(root_url),
                      alternate:   {
                        fr: canonical_url(root_url),
                        en: canonical_url(locale_root_en_url)
                      },
                      og:          {
                        type:  "#{ENV['WEBSITE_NAME']}:home",
                        url:   root_url,
                        image: image_url('logos/full_gradient.png')
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
