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
            render json:   TopicSerializer.new(shared_topic.result,
                                               include: [:contributors]).serializable_hash,
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
            render json:   ArticleCompleteSerializer.new(shared_article.result,
                                                         include: [:user, :topic, :tracker, :tags],
                                                         meta:    meta_attributes).serializable_hash,
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
