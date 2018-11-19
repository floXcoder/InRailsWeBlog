# frozen_string_literal: true

module Api::V1
  class ActivitiesController < ApiController
    skip_before_action :authenticate_user!

    before_action :authenticate_admin!

    respond_to :json

    def index
      activities = if params[:user_id]
                     PublicActivity::Activity.where(owner_id: params[:user_id], owner_type: 'User')
                   else
                     PublicActivity::Activity.all
                   end

      activities = activities.order('created_at desc')

      activities = params[:limit] ? activities.limit(params[:limit]) : activities.paginate(page: params[:page], per_page: Setting.per_page)

      respond_to do |format|
        format.json do
          render json: activities,
                 meta: meta_pagination_attributes(activities)
        end
      end
    end
  end
end
