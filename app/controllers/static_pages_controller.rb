class StaticPagesController < ApplicationController

  respond_to :html, :text

  def home
    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.home.title')),
                      description: I18n.t('views.home.description'),
                      canonical:   root_url
        render :home
      end
    end
  end

end
