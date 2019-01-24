# frozen_string_literal: true

# ActAsTrackedConcern
# Include this method in the controller:
# include TrackerConcern
module TrackerConcern
  extend ActiveSupport::Concern

  included do
    # For devise, skip user authentification
    skip_before_action :authenticate_user!, only: [:clicked, :viewed]
    # For locale, skip locale set up
    skip_before_action :set_locale, only: [:clicked, :viewed]
    # For pundit, skip authorization
    skip_after_action :verify_authorized, only: [:clicked, :viewed]
    # For Rails, skip token verification
    skip_before_action :verify_authenticity_token, only: [:clicked, :viewed]
  end

  # Tracker action method to get views from clients
  def viewed
    class_model = controller_path.gsub(/api\/v\d+/, '').classify.constantize
    class_model.track_views(params[:ids] || params[:id])

    head :no_content
  end

  # Tracker action method to get clicks from clients
  def clicked
    class_model = controller_path.gsub(/api\/v\d+/, '').classify.constantize
    class_model.track_clicks(params[:id], params[:user_id], params[:parent_id])

    head :no_content
  end
end
