# frozen_string_literal: true

class Admins::VisitsController < AdminsController
  before_action :verify_requested_format!

  respond_to :html, :json

  def index
    respond_to do |format|
      format.html do
        set_meta_tags title:   titleize_admin(I18n.t('views.admin.visits.title')),
                      noindex: true, nofollow: true

        render :index
      end

      format.json do
        if visit_params.present?
          render json: { visitsDetails: Admins::AnalyticsService.new.detail_visits(visit_params) }
        else
          render json: { visitsStats: Admins::AnalyticsService.new.global_visits }
        end
      end
    end
  end

  private

  def visit_params
    if params[:filter].present?
      params.expect(
        filter: [:date]
      ).compact_blank
    else
      {}
    end
  end

end
