# frozen_string_literal: true

module Api::V1
  class TopicsController < ApiController
    skip_before_action :authenticate_user!, only: [:index]

    after_action :verify_authorized, except: [:index]

    include TrackerConcern

    respond_to :json

    def index
      topics = Rails.cache.fetch("user_topics:#{params[:user_id] || current_user&.id}", expires_in: CONFIG.cache_time) do
        ::Topics::FindQueries.new(current_user, current_admin).all(filter_params.merge(user_id: params[:user_id]))
      end

      respond_to do |format|
        format.json do
          render json:            topics,
                 each_serializer: TopicSerializer
        end
      end
    end

    def switch
      user  = User.friendly.find(params[:user_id])
      topic = user.topics.friendly.find(params[:new_topic])
      authorize topic

      respond_to do |format|
        format.json do
          if user.switch_topic(topic) && user.save
            render json:       topic,
                   serializer: TopicSerializer,
                   status:     :ok
          else
            render json:   { errors: user.errors },
                   status: :forbidden
          end
        end
      end
    end

    def show
      topic = Topic.friendly.find(params[:id])
      authorize topic

      respond_to do |format|
        format.json do
          render json:       topic,
                 serializer: TopicSerializer,
                 with_tags:  true
        end
      end
    end

    def create
      user  = User.find(params[:user_id])
      topic = user.topics.build
      authorize topic

      stored_topic = ::Topics::StoreService.new(topic, topic_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_topic.success? && user.switch_topic(topic) && user.save
            render json:       stored_topic.result,
                   serializer: TopicSerializer,
                   status:     :created
          else
            flash.now[:error] = stored_topic.message
            render json:   { errors: stored_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def update
      topic = Topic.find(params[:id])
      authorize topic

      stored_topic = ::Topics::StoreService.new(topic, topic_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          if stored_topic.success?
            render json:       stored_topic.result,
                   serializer: TopicSerializer,
                   status:     :ok
          else
            flash.now[:error] = stored_topic.message
            render json:   { errors: stored_topic.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      user  = User.find(params[:user_id])
      topic = Topic.find(params[:id])
      authorize topic

      respond_to do |format|
        format.json do
          if topic.destroy
            # Switch topic if needed and return current topic
            current_topic = user.current_topic
            if user.current_topic_id == topic.id
              current_topic = user.topics.first
              user.switch_topic(user.topics.first)
              user.save
            end

            flash.now[:success] = I18n.t('views.topic.flash.successful_deletion')
            render json:       current_topic,
                   serializer: TopicSerializer,
                   status:     :ok
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
                                    pictures_attributes: [:id,
                                                          :image,
                                                          :_destroy])
    end

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:visibility,
                                       :user_id,
                                       :accepted,
                                       :bookmarked,
                                       user_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end

  end
end
