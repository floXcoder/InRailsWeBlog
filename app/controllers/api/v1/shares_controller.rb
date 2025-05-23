# frozen_string_literal: true

module Api::V1
  class SharesController < ApiController
    after_action :verify_authorized

    respond_to :json

    def topic
      topic = Topic.find(share_params[:topic_id])
      authorize topic, :share?

      shared_topic = ::Shares::StoreService.new(topic, share_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          flash.now[:success] = shared_topic.message
          if shared_topic.success?
            track_action(action: 'share_topic', topic_id: shared_topic.result.id)

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

    def article
      article = Article.find(share_params[:article_id])
      authorize article, :share?

      shared_article = ::Shares::StoreService.new(article, share_params.merge(current_user: current_user)).perform

      respond_to do |format|
        format.json do
          flash.now[:success] = shared_article.message
          if shared_article.success?
            track_action(action: 'share_article', article_id: shared_article.result.id)

            render json:   shared_article.result.serialized_json('complete'),
                   status: :ok
          else
            flash.now[:error] = shared_article.message
            render json:   { errors: shared_article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def share_params
      params.require(:share).permit(:topic_id,
                                    :article_id,
                                    :login)
    end

  end
end
