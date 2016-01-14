class AdminController < ApplicationController
  layout 'admin'

  before_action :authenticate_user!
  after_action :verify_authorized

  respond_to :html, :json

  def index
    authorize current_user, :admin?

    render :index
  end

end
