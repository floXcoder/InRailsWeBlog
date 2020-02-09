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

    before_action :set_context_user, only: []

    after_action :verify_authorized, except: [:index, :validation]

    include TrackerConcern

    respond_to :html, :json

    def index
      users = User.include_collection.all.order('users.id ASC')

      complete = filter_params[:complete] && admin_signed_in?
      if complete
        users = users.includes(:tracker)
      else
        users = users.paginate(page: params[:page], per_page: InRailsWeBlog.config.per_page)
      end

      respond_to do |format|
        format.json do
          if complete
            render json: UserCompleteSerializer.new(users,
                                                    include: [:tracker],
                                                    meta:    { root: 'users' })
          else
            render json: UserSampleSerializer.new(users,
                                                  meta: { root: 'users', **meta_attributes(pagination: users) })
          end
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
          if params[:complete] && (current_user&.id == user.id || current_user.admin?)
            User.track_views(user.id)
            render json: UserCompleteSerializer.new(user,
                                                    include: [:tracker],
                                                    meta:    meta_attributes)
          elsif params[:profile] && current_user&.id == user.id
            topic_slug = if params[:topic_slug].present?
                           params[:topic_slug]
                         elsif params[:article_slug].present?
                           params[:article_slug].scan(/@(.*?)$/)&.last&.first
                         end

            if topic_slug && current_user.current_topic.slug != topic_slug
              topic = Topic.find_by(slug: topic_slug)
              user.switch_topic(topic) && user.save if topic && topic.user_id == user.id
            end

            render json: UserProfileSerializer.new(user,
                                                   include: [:current_topic, :topics, :contributed_topics])
          else
            User.track_views(user.id)

            set_seo_data(:show_user,
                         user_slug: user.pseudo,
                         author:    user.pseudo,
                         model:     user,
                         og:        {
                                      type:  "#{ENV['WEBSITE_NAME']}:article",
                                      url:   user.link_path(host: ENV['WEBSITE_FULL_ADDRESS']),
                                      image: image_url('logos/favicon-192x192.png')
                                    }.compact)

            render json: UserSerializer.new(user,
                                            meta: meta_attributes)
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
          render json: CommentFullSerializer.new(user_comments,
                                                 include: [:user, :commentable],
                                                 meta:    { root: 'comments', **meta_attributes(pagination: user_comments) })
        end
      end
    end

    def recents
      user = User.friendly.find(params[:id])
      admin_or_authorize user

      user_recents = user.recent_visits(params[:limit])

      respond_to do |format|
        format.json do
          render json: {
            tags:     Tag.as_flat_json(user_recents[:tags], 'strict'),
            articles: Article.as_flat_json(user_recents[:articles], 'strict')
          }
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
        PublicActivity::Activity.last.update_attribute(:created_at, Time.zone.at((recent['date'] / 1000).round))
      end

      user_recents = user.recent_visits(params[:limit])

      respond_to do |format|
        format.json do
          render json: {
            tags:     Tag.as_flat_json(user_recents[:tags], 'strict'),
            articles: Article.as_flat_json(user_recents[:articles], 'strict')
          }
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
          render json: PublicActivitiesSerializer.new(user_activities,
                                                      meta: { root: 'activities', **meta_attributes(pagination: user_activities) })
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
          format.json do
            if params[:complete] && current_user
              authorize current_user, :admin?
              render json:   UserCompleteSerializer.new(stored_user.result,
                                                        include: [:tracker]),
                     status: :ok
            else
              render json: UserSerializer.new(stored_user.result)
            end
          end
        end
      else
        respond_to do |format|
          flash.now[:error] = stored_user.message
          format.json do
            render json:   { errors: stored_user.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:complete).reject { |_, v| v.blank? }
      else
        {}
      end
    end

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
