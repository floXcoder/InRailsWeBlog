# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  settings            :text             default({}), not null
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
  before_action :authenticate_user!, except: [:index, :show, :validation]
  before_action :verify_requested_format!
  after_action :verify_authorized, except: [:index, :validation]

  skip_before_action :set_locale, only: [:validation]

  include TrackerConcern

  respond_to :html, :json

  def index
    users = User.includes(:picture).all.order('users.id ASC')
    users = users.paginate(page: params[:page], per_page: Setting.per_page) if params[:page]

    respond_to do |format|
      format.html do
        expires_in 3.hours, public: true
        set_meta_tags title:       titleize(I18n.t('views.user.index.title')),
                      description: I18n.t('views.user.index.description')
        render :index, locals: { users: users }
      end
      format.json do
        render json:            users,
               each_serializer: UserSampleSerializer,
               meta:            meta_attributes(users)
      end
    end
  end

  def validation
    user_exists = false

    user_exists = User.pseudo?(user_validation_params[:pseudo]) if user_validation_params[:pseudo]
    user_exists = User.email?(user_validation_params[:email]) if user_validation_params[:email]
    user_exists = User.login?(user_validation_params[:login]) if user_validation_params[:login]

    respond_to do |format|
      if user_exists
        format.json { render json: { success: true }, status: :accepted }
      else
        format.json { render nothing: true, status: :not_found }
      end
    end
  end

  def show
    user = User.friendly.find(params[:id])
    authorize user

    respond_to do |format|
      # TODO
      # format.html do
      #   User.track_views(user.id)
      #   expires_in 3.hours, public: true
      #   set_meta_tags title:       titleize(I18n.t('views.user.show.title')),
      #                 description: I18n.t('views.user.show.description')

      # set_meta_tags title:       titleize(I18n.t('views.user.show.title', pseudo: user.pseudo)),
      #               description: I18n.t('views.user.show.description', pseudo: user.pseudo),
      #               author:      alternate_urls('users', user.slug)['fr'],
      #               canonical:   alternate_urls('users', user.slug)['fr'],
      #               alternate:   alternate_urls('users', user.slug),
      #               og:          {
      #                 type:  "#{ENV['WEBSITE_NAME']}:user",
      #                 url:   user_url(user),
      #                 image: user.avatar_url
      #               }

      #   render :show, locals: { user: user, mode: nil }
      # end

      format.json do
        if params[:complete_user] && current_user && (current_user.id == user.id || current_user.admin?)
          User.track_views(user.id)
          render json:       user,
                 serializer: UserCompleteSerializer
        elsif params[:user_profile] && current_user&.id == user.id
          render json:       user,
                 serializer: UserProfileSerializer
        else
          User.track_views(user.id)
          render json:       user,
                 serializer: UserSerializer
        end
      end
    end
  end

  def bookmarks
    user = User.friendly.find(params[:id])
    authorize user

    respond_to do |format|
      format.html do
        set_meta_tags title:       titleize(I18n.t('views.user.bookmarks.title', pseudo: user.pseudo)),
                      description: I18n.t('views.user.bookmarks.description', pseudo: user.pseudo),
                      author:      user_canonical_url(user.slug),
                      canonical:   user_canonical_url("#{user.slug}/bookmarks")
        render :show, locals: {
          user: user,
          mode: 'bookmark'
        }
      end
    end
  end

  # def draft
  #   user = User.friendly.find(params[:id])
  #   authorize user
  #
  #   render :show, locals: { user: user, mode: 'draft' }
  # end

  def comments
    user = User.includes(:comments).friendly.find(params[:id])
    authorize user

    user_comments = user.comments.order('comments.created_at DESC')
    user_comments = user_comments.paginate(page: params[:page], per_page: Setting.per_page) if params[:page]

    respond_to do |format|
      format.json do
        render json:            user_comments,
               each_serializer: CommentFullSerializer,
               meta:            meta_attributes(user_comments)
      end
    end
  end

  def activities
    user = User.includes(:activities).friendly.find(params[:id])
    authorize user

    user_activities = user.activities.order('activities.created_at DESC')
    user_activities = user_activities.paginate(page: params[:page], per_page: Setting.per_page) if params[:page]

    respond_to do |format|
      format.json do
        render json:            user_activities,
               each_serializer: PublicActivitiesSerializer,
               meta:            meta_attributes(user_activities)
      end
    end
  end

  def edit
    user = User.friendly.find(params[:id])
    authorize user

    user.build_picture unless user.picture

    respond_to do |format|
      format.html do
        set_meta_tags title:     titleize(I18n.t('views.user.edit.title')),
                      canonical: ride_canonical_url("#{user.id}/edit")
        render :edit, locals: { user: user }
      end
    end
  end

  def update
    user = User.friendly.find(params[:id])
    authorize user

    update_user_params = user_params
    # User picture: take uploaded picture otherwise remote url
    if params[:picture_attributes] &&
      params[:picture_attributes][:image] &&
      params[:picture_attributes][:remote_image_url] &&
      params[:picture_attributes][:remote_image_url].present?
      update_user_params[:picture_attributes].delete(:remote_image_url)
    end

    # Current use can not remove his own admin rights
    update_user_params.delete(:admin) if current_user&.admin? && current_user.id == user.id

    if user.update_without_password(update_user_params)
      respond_to do |format|
        flash[:success] = t('views.user.flash.successful_update')
        format.html do
          redirect_to root_user_path(user)
        end
        format.json do
          if params[:complete_user] && current_user
            authorize current_user, :admin?
            render json:       user,
                   serializer: UserCompleteSerializer,
                   status:     :ok
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
          if params[:complete_user] && current_user
            authorize current_user, :admin?
            render json:       user,
                   serializer: UserCompleteSerializer,
                   status:     :ok
          else
            render json:   user,
                   status: :forbidden
          end
        end
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name,
                                 :last_name,
                                 :city,
                                 :phone_number,
                                 :country,
                                 :additional_info,
                                 picture_attributes: [:id,
                                                      :image,
                                                      :remote_image_url,
                                                      :_destroy])
  end

  def user_validation_params
    if params[:user]
      params.require(:user).permit(:login,
                                   :pseudo,
                                   :email,
                                   :password,
                                   :remember_me)
    else
      {}
    end
  end
end
