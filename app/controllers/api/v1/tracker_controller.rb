# frozen_string_literal: true

module Api::V1
  class TrackerController < ApiController
    skip_before_action :authenticate_user!
    skip_before_action :verify_authenticity_token
    skip_before_action :set_env

    respond_to :json

    def action
      tracking_params = session[:tracking_data].presence || Rails.cache.fetch("#{tracker_params[:path].tr('/', '-')}-tracking")
      if tracking_params
        ahoy.track tracking_params.delete(:action) || 'page_visit', tracker_params.merge(tracking_params.except(:path))
      else
        ahoy.track 'page_visit', tracker_params
      end

      current_visit&.update(validated: true, takeoff_page: tracker_params[:url], ended_at: Time.zone.now, pages_count: current_visit.pages_count + 1)

      session[:tracking_data] = nil

      head :no_content
    end

    private

    def tracker_params
      if params[:tracker]
        params.require(:tracker).permit(
          :action_name,
          :url,
          :title,
          :path,
          :locale
        ).reject { |_, v| v.blank? }
      else
        {}
      end
    end
  end
end
