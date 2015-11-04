class UsersController < ApplicationController
  before_filter :authenticate_user!, except: [:check_id]
  after_action :verify_authorized, except: [:index, :check_id]

  def index
    users = User.all

    render :index, locals: { users: users }
  end

  def show
    user = User.friendly.find(params[:id])
    authorize user

    render :show, locals: { user: user }
  end

  def preference
    user = User.find(params[:id])
    authorize user

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def update_preference
    user = User.find(params[:id])
    authorize user

    if params[:preferences]
      params[:preferences].each do |pref_type, pref_value|
        user.write_preference(pref_type, pref_value)
      end
    end

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def edit
    user = User.friendly.find(params[:id])
    authorize user

    render :edit, locals: { user: user }
  end

  def update
    user = User.friendly.find(params[:id])
    authorize user

    if user.update_without_password(user_params)
      flash[:success] = t('views.user.flash.successful_update')
      redirect_to root_user_path(user)
    else
      flash[:error] = t('views.user.flash.error_update')
      render :edit, locals: { user: user }
    end
  end

  def check_id
    result = 'false'

    if params[:pseudo]
      pseudo = User.pseudo?(params[:pseudo])
      result = 'true' unless pseudo
    end

    if params[:email]
      email = User.email?(params[:email])
      result = 'true' unless email
    end

    if params[:login]
      login = User.login?(params[:login])
      result = 'true' if login
    end

    respond_to do |format|
      format.json { render json: result }
      format.html { render json: result }
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name,
                                 :last_name,
                                 :age,
                                 :city,
                                 :country,
                                 :additional_info)
  end
end
