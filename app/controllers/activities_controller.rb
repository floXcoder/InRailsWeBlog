class ActivitiesController < ApplicationController
  before_action :authenticate_admin!

  respond_to :json

  def index
    activities = PublicActivity::Activity.order('created_at desc')

    respond_to do |format|
      format.json { render json: activities }
    end
  end
end
