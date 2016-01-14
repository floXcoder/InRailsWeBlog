# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  preferences            :text             default({}), not null
#  admin                  :boolean          default(FALSE), not null
#  slug                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :validation]
  after_action :verify_authorized, except: [:index, :show, :validation]

  skip_before_action :set_locale, only: [:validation]

  include TrackerConcern

  respond_to :html, :json

  def index
    users = User.includes(:picture).all.order('users.id ASC')
    users = users.paginate(page: params[:page], per_page: CONFIG.per_page) if params[:page]

    respond_to do |format|
      format.html { render :index, locals: { users: users } }
      format.json { render json: users, each_serializer: UserSampleSerializer }
    end
  end

  def show
    user = User.friendly.find(params[:id])

    respond_to do |format|
      format.html do
        User.track_views(user.id)
        render :show, locals: { user: user, mode: nil }
      end

      format.json do
        if params[:user_full] && current_user
          authorize current_user, :admin?
          render json: user, serializer: UserFullSerializer
        else
          render json: user
        end
      end
    end
  end

  def bookmarks
    user = User.friendly.find(params[:id])
    authorize user

    render :show, locals: { user: user, mode: 'bookmark' }
  end

  def temporary
    user = User.friendly.find(params[:id])
    authorize user

    render :show, locals: { user: user, mode: 'temporary' }
  end

  def preferences
    user = User.find(params[:id])
    authorize user

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def update_preferences
    user = User.find(params[:id])
    authorize user

    if params[:preferences]
      params[:preferences].each do |pref_type, pref_value|
        if pref_value == 'true'
          pref_value = true
        elsif pref_value == 'false'
          pref_value = false
        end
        user.preferences[pref_type.downcase.to_sym] = pref_value
      end
      user.save
    end

    respond_to do |format|
      format.html { render json: user, serializer: PreferenceSerializer, content_type: 'application/json' }
      format.json { render json: user, serializer: PreferenceSerializer }
    end
  end

  def edit
    user = User.friendly.find(params[:id])
    authorize user

    user.build_picture unless user.picture

    render :edit, locals: { user: user }
  end

  def update
    user = User.friendly.find(params[:id])
    authorize user

    update_user_params = user_params
    # User picture: take uploaded picture otherwise remote url
    if params[:picture_attributes] &&
      params[:picture_attributes][:image] &&
      params[:picture_attributes][:remote_image_url] &&
      !params[:picture_attributes][:remote_image_url].blank?
      update_user_params[:picture_attributes].delete(:remote_image_url)
    end

    # Current use can not remove his own admin rights
    update_user_params.delete(:admin) if current_user.try(:admin?) && current_user.id == user.id

    if user.update_without_password(update_user_params)
      respond_to do |format|
        flash[:success] = t('views.user.flash.successful_update')
        format.html do
          redirect_to root_user_path(user)
        end
        format.json do
          if params[:user_full] && current_user
            authorize current_user, :admin?
            render json: user, serializer: UserFullSerializer
          else
            render json: user
          end
        end
      end
    else
      respond_to do |format|
        flash.now[:error] = t('views.user.flash.error_update')
        format.html do
          render :edit, locals: { user: user }
        end
        format.json do
          if params[:user_full] && current_user
            authorize current_user, :admin?
            render json: user, serializer: UserFullSerializer
          else
            render json: user
          end
        end
      end
    end
  end

  def validation
    user = {}

    if params[:user]
      user[:pseudo] = User.pseudo?(user_validation_params[:pseudo]) if user_validation_params[:pseudo]
      user[:email]  = User.email?(user_validation_params[:email]) if user_validation_params[:email]
      user[:login]  = User.login?(user_validation_params[:login]) if user_validation_params[:login]
    end

    respond_to do |format|
      format.json { render json: { user: user } }
      format.html { render json: { user: user } }
    end
  end

  def comments
    user = User.includes(:comments).friendly.find(params[:id])
    authorize user

    user_comments = user.comments.order('comments.created_at DESC')
    user_comments = user_comments.paginate(page: params[:page], per_page: CONFIG.per_page) if params[:page]

    respond_to do |format|
      format.html {
        render json:            user_comments,
               serializer:      PaginationSerializer,
               each_serializer: CommentFullSerializer,
               content_type:    'application/json'
      }
      format.json {
        render json:            user_comments,
               serializer:      PaginationSerializer,
               each_serializer: CommentFullSerializer
      }
    end
  end

  def activities
    user = User.includes(:activities).friendly.find(params[:id])
    authorize user

    user_activities = user.activities.order('activities.created_at DESC')
    user_activities = user_activities.paginate(page: params[:page], per_page: CONFIG.per_page) if params[:page]

    respond_to do |format|
      format.html {
        render json:            user_activities,
               serializer:      PaginationSerializer,
               each_serializer: PublicActivitiesSerializer,
               content_type:    'application/json'
      }
      format.json {
        render json:            user_activities,
               serializer:      PaginationSerializer,
               each_serializer: PublicActivitiesSerializer
      }
    end
  end

  private
  def user_params
    if current_user.try(:admin?)
      params.require(:user).permit(:first_name,
                                   :last_name,
                                   :age,
                                   :city,
                                   :country,
                                   :additional_info,
                                   :admin,
                                   picture_attributes: [:id,
                                                        :image,
                                                        :remote_image_url,
                                                        :_destroy])
    else
      params.require(:user).permit(:first_name,
                                   :last_name,
                                   :age,
                                   :city,
                                   :country,
                                   :additional_info,
                                   picture_attributes: [:id,
                                                        :image,
                                                        :remote_image_url,
                                                        :_destroy])
    end
  end

  def user_validation_params
    params.require(:user).permit(:login,
                                 :pseudo,
                                 :email,
                                 :password,
                                 :remember_me)
  end
end
