# frozen_string_literal: true

# ActAsTrackedConcern
# Include this method in the controller:
# include TrackerConcern
module TrackerConcern
  extend ActiveSupport::Concern

  included do
    # For devise, skip user authentification
    skip_before_action :authenticate_user!, only: [:clicked, :viewed]
    # Skip locale env up
    skip_before_action :set_env, only: [:clicked, :viewed]
    # Do not set current user
    skip_before_action :set_context_user, only: [:clicked, :viewed]
    # For pundit, skip authorization
    skip_after_action :verify_authorized, only: [:clicked, :viewed]
    # For Rails, skip token verification
    skip_before_action :verify_authenticity_token, only: [:clicked, :viewed]
  end

  # Tracker action method to get views from clients
  def viewed
    unless ENV['TRACKER_EXCLUDED_IPS'].present? && ENV['TRACKER_EXCLUDED_IPS'].split(', ').any? { |ip| (request.remote_ip.presence || request.ip)&.include?(ip) }
      class_model = controller_path.gsub(/api\/v\d+/, '').classify.constantize
      class_model.respond_to?(:track_views) && class_model.track_views(params[:ids] || params[:id], params[:user_id], params[:parent_id])
    end

    head :no_content
  end

  # Tracker action method to get clicks from clients
  def clicked
    unless ENV['TRACKER_EXCLUDED_IPS'].present? && ENV['TRACKER_EXCLUDED_IPS'].split(', ').any? { |ip| (request.remote_ip.presence || request.ip)&.include?(ip) }
      class_model = controller_path.gsub(/api\/v\d+/, '').classify.constantize
      class_model.respond_to?(:track_clicks) && class_model.track_clicks(params[:id], params[:user_id], params[:parent_id])
    end

    head :no_content
  end

  protected

  def track_visit(class_model, id, user_id = nil, parent_id = nil)
    class_model.respond_to?(:track_visits) && class_model.track_visits(id, user_id, parent_id)
  end

end
