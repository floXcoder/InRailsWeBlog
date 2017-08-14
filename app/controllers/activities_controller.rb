class ActivitiesController < ApplicationController
  before_action :authenticate_admin!
  before_action :verify_requested_format!

  respond_to :json

  def index
    activities = PublicActivity::Activity.order('created_at desc')

    respond_to do |format|
      format.json do
        render json: activities
      end
    end
  end
end
