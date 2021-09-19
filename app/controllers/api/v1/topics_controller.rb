# frozen_string_literal: true

module Api::V1
  class TopicsController < ApiController
    skip_before_action :authenticate_user!, only: [:index, :show]

    before_action :set_context_user, except: [:index]

    after_action :verify_authorized, except: [:index]

    include TrackerConcern

    respond_to :json

    def index
      complete = filter_params[:complete] && admin_signed_in?

      topics = if complete
                 ::Topics::FindQueries.new(nil, current_admin).complete
               else
                 ::Topics::FindQueries.new(current_user, current_admin).all(filter_params.merge(user_id: params[:user_id]))
               end

      expires_in InRailsWeBlog.config.cache_time, public: true
      if stale?(topics, template: false, public: true)
        respond_to do |format|
          format.json do
            if complete
              render json: Topic.serialized_json(topics, 'complete')
            else
              render json: Topic.serialized_json(topics, 'normal')
            end
          end
        end
      end
    end

    def switch
      topic = current_user.topics.find_by(slug: params[:new_topic]) || current_user.contributed_topics.find_by(slug: params[:new_topic])
      authorize topic

      respond_to do |format|
        format.json do
          if current_user.switch_topic(topic) && current_user.save
            track_action(action: 'topic_switch', topic_id: topic.id)

            render json:   topic.serialized_json('normal'),
                   status: :ok
          else
            render json:   { errors: current_user.errors },
                   status: :forbidden
          end
        end
      end
    end

    def show
      topic = @context_user.topics.friendly.find(params[:id])
      authorize topic

      expires_in InRailsWeBlog.config.cache_time, public: true
      if stale?(topic, template: false, public: true)
        respond_to do |format|
          format.json do
            set_seo_data(:user_topic,
                         model:         topic,
                         topic_slug:    topic,
                         topic_content: topic.description&.summary(InRailsWeBlog.config.seo_meta_desc_length, strip_html: true, remove_links: true),
                         user_slug:     topic.user,
                         author:        topic.user.pseudo)

            if current_user && topic.user?(current_user)
              render json: topic.serialized_json('complete')
            else
              render json: topic.serialized_json('normal',
                                                 meta: {
                                                         trackingData: { topic_id: topic.id },
                                                         **(params[:no_meta] ? {} : meta_attributes)
                                                       }.compact)
            end
          end
        end
      end
    end

    def create
      topic = current_user.topics.build
      authorize topic

      stored_topic = ::Topics::StoreService.new(topic, topic_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_topic.success? && current_user.switch_topic(topic) && current_user.save
            track_action(action: 'topic_create', topic_id: stored_topic.result.id)

            render json:   stored_topic.result.serialized_json('complete'),
                   status: :created
          else
            flash.now[:error] = stored_topic.message
            render json:   { errors: stored_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def edit
      topic = @context_user.topics.friendly.find(params[:id])
      authorize topic

      respond_to do |format|
        format.json do
          set_seo_data(:edit_topic,
                       topic_slug: topic,
                       user_slug:  topic.user,
                       author:     topic.user.pseudo)

          render json: topic.serialized_json('complete',
                                             meta: {
                                               trackingData: { tag_id: tag.id },
                                               **meta_attributes
                                             })
        end
      end
    end

    def update
      topic = current_user.topics.find(params[:id])
      authorize topic

      stored_topic = ::Topics::StoreService.new(topic, topic_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_topic.success?
            track_action(action: 'topic_update', topic_id: stored_topic.result.id)

            flash.now[:success] = stored_topic.message
            render json:   stored_topic.result.serialized_json('complete'),
                   status: :ok
          else
            flash.now[:error] = stored_topic.message
            render json:   { errors: stored_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def share
      topic = current_user.topics.find(params[:id])
      authorize topic

      shared_topic = ::Shares::StoreService.new(topic, params[:login], current_user: current_user).perform

      respond_to do |format|
        format.json do
          flash.now[:success] = shared_topic.message
          if shared_topic.success?
            track_action(action: 'topic_share', topic_id: shared_topic.id)

            render json:   shared_topic.result.serialized_json('normal'),
                   status: :ok
          else
            flash.now[:error] = shared_topic.message
            render json:   { errors: shared_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update_priority
      topics = []
      priority_params[:topic_ids].reverse.each_with_index do |id, i|
        topic = Topic.find(id)
        admin_or_authorize topic, :update?
        topics << topic if topic.update_columns(priority: i + 1)
      end

      respond_to do |format|
        format.json do
          if topics.present?
            flash.now[:success] = t('views.topic.flash.successful_priority_update')
            render json:   Topic.serialized_json(current_user.topics),
                   status: :ok
          else
            flash.now[:error] = t('views.topic.flash.error_priority_update')
            render json:   { errors: t('views.topic.flash.error_priority_update') },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      topic = current_user.topics.find(params[:id])
      authorize topic

      respond_to do |format|
        format.json do
          if topic.destroy
            track_action(action: 'topic_destroy', topic_id: topic.id)

            # Switch topic if needed and return current topic
            current_topic = current_user.current_topic
            if current_user.current_topic_id == topic.id
              current_topic = current_user.topics.first
              current_user.switch_topic(current_topic)
              current_user.save
            end

            flash.now[:success] = I18n.t('views.topic.flash.successful_deletion')
            render json:   current_topic.serialized_json('normal'),
                   status: :ok
          else
            flash.now[:error] = I18n.t('views.topic.flash.error_deletion', errors: topic.errors.to_s)
            render json:   { errors: topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def topic_params
      params.require(:topic).permit(:name,
                                    :mode,
                                    :description,
                                    :priority,
                                    :visibility,
                                    :archived,
                                    :accepted,
                                    :picture,
                                    description_translations: {},
                                    languages:                [],
                                    pictures_attributes:      [:id,
                                                               :image,
                                                               :_destroy])
    end

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:visibility,
                                       :user_id,
                                       :accepted,
                                       :bookmarked,
                                       :order,
                                       :complete,
                                       user_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end

    def priority_params
      if params[:topic_ids]
        params.permit(topic_ids: [])
      else
        {}
      end
    end

  end
end
