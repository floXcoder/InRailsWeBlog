class Admin::ErrorsManagerController < AdminController

  def index
    authorize current_user, :admin?

    render :index
  end
end
