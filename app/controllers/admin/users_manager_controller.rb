class Admin::UsersManagerController < AdminController
  before_action :authenticate_user!
  after_action :verify_authorized

  def index
    authorize current_user, :admin?

    render :index
  end

  def show
    authorize current_user, :admin?

    user_id = params[:id]

    render :show, locals: { user_id: user_id }
  end

end
