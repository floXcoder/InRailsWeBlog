class AdminsController < ApplicationController
  before_filter :authenticate_user!
  after_action :verify_authorized

  respond_to :html

  def show
    authorize current_user, :admin?

    render :show
  end

end
