class Users::TopicsController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  def switch
    user  = User.friendly.find(params[:user_id])
    topic = Topic.friendly.find(params[:id])
    authorize topic

    respond_to do |format|
      format.json do
        if user.switch_topic(topic)
          render json:       topic,
                 serializer: TopicSerializer,
                 status:     :ok
        else
          render json:   topic.errors,
                 status: :forbidden
        end
      end
    end
  end

  def new
    user  = User.find(params[:user_id])
    topic = user.topics.build
    authorize topic

    topic.format_attributes(topic_params)

    respond_to do |format|
      format.json do
        if topic.save
          render json:       topic,
                 serializer: TopicSerializer,
                 status:     :accepted
        else
          render json:   topic.errors,
                 status: :forbidden
        end
      end
    end
  end

  def update
    # user  = User.find(params[:user_id])
    topic = Topic.find(params[:id])
    authorize topic

    topic.format_attributes(topic_params)

    respond_to do |format|
      format.json do
        if topic.save
          render json:       topic,
                 serializer: TopicSerializer,
                 status:     :ok
        else
          render json:   topic.errors,
                 status: :forbidden
        end
      end
    end
  end

  def destroy
    # user  = User.find(params[:user_id])
    topic = Topic.find(params[:id])
    authorize topic

    respond_to do |format|
      format.json do
        if topic.destroy
          render json:   { id: topic.id },
                 status: :accepted
        else
          render json:   topic.errors,
                 status: :forbidden
        end
      end
    end
  end

  private

  def topic_params
    params.require(:topic).permit(:name,
                                  :description,
                                  :priority,
                                  :visibility,
                                  :archived,
                                  :accepted,
                                  :picture,
                                  location_attributes: [:longitude,
                                                        :latitude],
                                  pictures_attributes: [:id,
                                                        :image,
                                                        :_destroy]).tap do |whitelisted|
      whitelisted[:pictures] = params[:topic][:pictures]
    end
  end
end
