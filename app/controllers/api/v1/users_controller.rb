# frozen_string_literal: true

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
#  settings               :text             default({}), not null
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

module Api::V1
  class UsersController < ApiController
    skip_before_action :authenticate_user!, only: [:index, :show, :validation]
    skip_before_action :set_locale, only: [:validation]

    after_action :verify_authorized, except: [:index, :validation]

    include TrackerConcern

    respond_to :html, :json

    def index
      users = User.include_collection.all.order('users.id ASC')
      users = users.paginate(page: params[:page], per_page: InRailsWeBlog.config.per_page)

      respond_to do |format|
        format.html do
          expires_in InRailsWeBlog.config.cache_time, public: true
          set_meta_tags title:       titleize(I18n.t('views.user.index.title')),
                        description: I18n.t('views.user.index.description')

          render :index, locals: { users: users }
        end
        format.json do
          render json:            users,
                 each_serializer: UserSampleSerializer,
                 meta:            meta_attributes(pagination: users)
        end
      end
    end

    def validation
      user_exists = false

      user_exists = User.pseudo?(user_validation_params[:pseudo]) if user_validation_params[:pseudo]
      user_exists = User.email?(user_validation_params[:email]) if user_validation_params[:email]
      user_exists = User.login?(user_validation_params[:login]) if user_validation_params[:login]

      respond_to do |format|
        format.json do
          if user_exists
            render json: { success: true }
          else
            render json: { success: false }
          end
        end
      end
    end

    def show
      user = User.friendly.find(params[:id])
      authorize user

      respond_to do |format|
        format.json do
          #  Add meta tags (and expiration ?) to react
          #   expires_in InRailsWeBlog.config.cache_time, public: true
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
          #

          if params[:complete] && (current_user&.id == user.id || current_user.admin?)
            User.track_views(user.id)
            render json:       user,
                   serializer: UserCompleteSerializer,
                   meta:       meta_attributes
          elsif params[:profile] && current_user&.id == user.id
            topic_slug = if params[:topic_slug].present?
                           params[:topic_slug]
                         elsif params[:article_slug].present?
                           params[:article_slug].scan(/@(.*?)$/).last.first
                         end

            if topic_slug && current_user.current_topic.slug != topic_slug
              topic = Topic.friendly.find_by(slug: topic_slug)
              user.switch_topic(topic) && user.save if topic && topic.user_id == user.id
            end

            render json:       user,
                   serializer: UserProfileSerializer
          else
            User.track_views(user.id)
            render json:       user,
                   serializer: UserSerializer,
                   meta:       meta_attributes
          end
        end
      end
    end

    def comments
      user = User.includes(:comments).friendly.find(params[:id])
      authorize user

      user_comments = user.comments.order('comments.created_at DESC')
      user_comments = user_comments.paginate(page: params[:page], per_page: InRailsWeBlog.config.per_page) if params[:page]

      respond_to do |format|
        format.json do
          render json:            user_comments,
                 each_serializer: CommentFullSerializer,
                 meta:            meta_attributes(pagination: user_comments)
        end
      end
    end

    def recents
      user = User.friendly.find(params[:id])
      admin_or_authorize user

      user_recents = user.recent_visits(params[:limit])
      recents      = {
        tags:     Tag.as_flat_json(user_recents[:tags], strict: true),
        articles: Article.as_flat_json(user_recents[:articles], strict: true),
        # topics: Topic.as_flat_json(user_recents[:topics], strict: true)
        # users: User.as_flat_json(user_recents[:users], strict: true)
      }

      respond_to do |format|
        format.json do
          render json: recents,
                 root: 'recents'
        end
      end
    end

    def update_recents
      user = User.friendly.find(params[:id])
      admin_or_authorize user, :recents?

      params[:recents]&.each do |recent|
        next unless recent['user_id'].to_s == user.id.to_s

        user.create_activity(:visit,
                             recipient_type: recent['type'].classify,
                             recipient_id:   recent['element_id'].to_i,
                             params:         { topic_id: recent['parent_id'] })
        PublicActivity::Activity.last.update_attribute(:created_at, Time.at((recent['date'] / 1000).round))
      end

      user_recents = user.recent_visits(params[:limit])
      recents      = {
        tags:     Tag.as_flat_json(user_recents[:tags], strict: true),
        articles: Article.as_flat_json(user_recents[:articles], strict: true)
      }

      respond_to do |format|
        format.json do
          render json: recents,
                 root: 'recents'
        end
      end
    end

    def activities
      user = User.includes(:performed_activities).friendly.find(params[:id])
      authorize user

      user_activities = user.performed_activities.order('activities.created_at DESC')
      user_activities = user_activities.paginate(page: params[:page], per_page: InRailsWeBlog.config.per_page) if params[:page]

      respond_to do |format|
        format.json do
          render json:            user_activities,
                 each_serializer: PublicActivitiesSerializer,
                 root:            'activities',
                 meta:            meta_attributes(pagination: user_activities)
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
                        canonical: user_canonical_url("#{user.id}/edit")
          render :edit, locals: { user: user }
        end
      end
    end

    def update
      user = User.friendly.find(params[:id])
      authorize user

      stored_user = ::Users::StoreService.new(user, user_params.merge(current_user: current_user)).perform

      if stored_user.success?
        respond_to do |format|
          flash[:success] = stored_user.message
          format.html do
            redirect_to root_user_path(user)
          end
          format.json do
            if params[:complete] && current_user
              authorize current_user, :admin?
              render json:       stored_user.result,
                     serializer: UserCompleteSerializer,
                     status:     :ok
            else
              render json:       stored_user.result,
                     serializer: UserSerializer
            end
          end
        end
      else
        respond_to do |format|
          flash.now[:error] = stored_user.message
          format.html do
            render :edit, locals: { user: user }
          end
          format.json do
            render json:   { errors: stored_user.errors },
                   status: :unprocessable_entity
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
end
