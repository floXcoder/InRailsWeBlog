class ActivitiesController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  def index
    authorize current_user, :admin?

    activities = PublicActivity::Activity.order('created_at desc')

    respond_to do |format|
      format.json { render json: activities }
    end
  end

end
