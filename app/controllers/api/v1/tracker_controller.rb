# frozen_string_literal: true

module Api::V1
  class TrackerController < ApiController
    skip_before_action :authenticate_user!
    skip_before_action :verify_authenticity_token
    skip_before_action :define_environment
    skip_before_action :track_ahoy_visit

    respond_to :json

    def action
      (head :no_content and return) if @seo_mode

      ahoy.track(params.dig(:tracker, :action).presence || 'page_visit', tracker_params)

      current_visit&.update(validated: true, takeoff_page: tracker_params[:url], ended_at: Time.zone.now, pages_count: current_visit.pages_count + 1)

      head :no_content
    end

    private

    def tracker_params
      if params[:tracker]
        params.require(:tracker).permit(
          :url,
          :title,
          :locale,
          :article_id,
          :topic_id,
          :parent_id,
          :topic_id,
          :tag_id,
          :user_id,
          :article_ids,
          :tag_ids,
          :topic_ids,
          :user_ids,
          :article_slug,
          :tag_slug,
          :topic_slug,
          :user_slug
        ).compact_blank
      else
        {}
      end
    end
  end
end
