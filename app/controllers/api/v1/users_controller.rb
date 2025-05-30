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
    skip_before_action :authenticate_user!, only: [:index, :show, :validation, :recents]
    skip_before_action :define_environment, only: [:validation]
    skip_before_action :track_ahoy_visit, only: [:validation, :recents]

    # Require for tracker concern
    before_action :set_context_user, only: []

    after_action :verify_authorized, except: [:index, :validation, :recents]

    include TrackerConcern

    respond_to :html, :json

    def index
      users = User.include_collection.all.order('users.id ASC')

      complete = filter_params[:complete] && admin_signed_in?
      users    = if complete
                   users.includes(:tracker)
                 else
                   users.paginate(page: params[:page]&.to_i, per_page: InRailsWeBlog.settings.per_page)
                 end

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache? || stale?(users, template: false, public: true)
        respond_to do |format|
          format.json do
            if complete
              render json: User.serialized_json(users, 'complete', params: { no_cache: complete })
            else
              render json: User.serialized_json(users, 'sample', meta: meta_attributes(pagination: users))
            end
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
      user = current_user&.id == params[:id]&.to_i ? current_user : User.friendly.find(params[:id])
      authorize user

      with_cache?(user) ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      respond_to do |format|
        format.json do
          if params[:complete] && (current_user&.id == user.id || current_user.admin?)
            User.track_views(user.id)
            render json: user.serialized_json('complete')
          elsif params[:profile] && current_user&.id == user.id
            topic_slug = if params[:topic_slug].present?
                           params[:topic_slug]
                         elsif params[:article_slug].present?
                           params[:article_slug].scan(/@(.*?)$/)&.last&.first
                         end

            if topic_slug
              topic = Topic.find_by(slug: topic_slug, user_id: user.id)

              if topic && user.current_topic.slug != topic_slug
                user.switch_topic(topic) && user.save
              end
            end

            render json: user.serialized_json('profile')
          else
            User.track_views(user.id)

            set_seo_data(:show_user,
                         user_slug: user,
                         author:    user.pseudo,
                         model:     user,
                         og:        {
                                      type:  "#{ENV['WEBSITE_NAME']}:article",
                                      url:   user.link_path(host: ENV['WEBSITE_URL']),
                                      image: image_url('logos/favicon-192x192.png')
                                    }.compact)

            if !with_cache?(user) || stale?(user, template: false, public: true)
              render json: user.serialized_json(meta: !params[:no_meta] && meta_attributes)
            end
          end
        end
      end
    end

    def comments
      user = User.includes(:comments).friendly.find(params[:id])
      authorize user

      user_comments = user.comments.order('comments.created_at DESC')
      user_comments = user_comments.paginate(page: params[:page].to_i, per_page: InRailsWeBlog.settings.per_page) if params[:page]

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      if !with_cache? || stale?(user_comments, template: false, public: true)
        respond_to do |format|
          format.json do
            render json: CommentFullSerializer.new(user_comments,
                                                   include: [:user, :commentable],
                                                   meta:    { root: 'comments', **meta_attributes(pagination: user_comments) }).serializable_hash
          end
        end
      end
    end

    def recents
      article_ids      = nil
      updated_articles = nil
      tag_ids          = nil

      if current_user && params[:id].present?
        user = current_user&.id == params[:id].to_i ? current_user : User.friendly.find(params[:id])
        if user
          admin_or_authorize user

          article_ids, tag_ids = user.recent_visits(params[:limit]&.to_i)
          updated_articles     = Article.includes(:user, :topic, :tagged_articles, :tags).not_archived.last_updated(current_user.id, params[:limit]&.to_i)
        end
      elsif cookies[:ahoy_visitor].present?
        article_ids = Ahoy::Event.joins(:visit).merge(Ahoy::Visit.where(visitor_token: cookies[:ahoy_visitor])).recent_articles(params[:limit]&.to_i).map { |event| event.properties['article_id'] }.uniq
      end

      reset_cache_headers
      respond_to do |format|
        format.json do
          render json: {
            tags:            Tag.flat_serialized_json(Tag.includes(:tagged_articles).where(id: tag_ids), 'sample', with_model: false),
            articles:        Article.flat_serialized_json(Article.includes(:user, :topic, :tagged_articles, :tags).not_archived.where(id: article_ids), 'sample', with_model: false, params: { without_pictures: true }),
            updatedArticles: Article.flat_serialized_json(updated_articles, 'sample', with_model: false, params: { without_pictures: true })
          }
        end
      end
    end

    def update
      user = current_user&.id == params[:id]&.to_i ? current_user : User.friendly.find(params[:id])
      authorize user

      stored_user = ::Users::StoreService.new(user, user_params.merge(current_user: current_user)).perform

      if stored_user.success?
        respond_to do |format|
          track_action(action: 'user_update', user_id: stored_user.result.id)

          flash[:success] = stored_user.message
          format.json do
            if params[:complete] && current_user
              authorize current_user, :admin?
              render json:   stored_user.result.serialized_json('complete'),
                     status: :ok
            else
              render json: stored_user.result.serialized_json(stored_user.result, 'profile')
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
        params.require(:filter).permit(:complete).compact_blank
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
