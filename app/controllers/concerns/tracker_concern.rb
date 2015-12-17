module TrackerConcern
  extend ActiveSupport::Concern

  included do
    skip_before_action :authenticate_user!, only: [:clicked, :viewed]
    skip_before_action :set_locale, only: [:clicked, :viewed]
    skip_after_action :verify_authorized, only: [:clicked, :viewed]
  end

  def clicked
    class_model = params[:controller].classify.constantize
    class_model.track_clicks(params[:id])
    render nothing: true
  end

  def viewed
    class_model = params[:controller].classify.constantize
    class_model.track_views(params[:id].split(','))

    w current_user

    render nothing: true
  end

  private

  def tracker_params
    params.require(:tracker).permit(:id,
                                    :model)
  end
end
