# frozen_string_literal: true

module Api::V1
  class Articles::OutdatedController < ApiController
    after_action :verify_authorized

    respond_to :json

    def create
      article = Article.find(params[:article_id])
      authorize article, :add_outdated?

      respond_to do |format|
        format.json do
          if article.mark_as_outdated(current_user)
            track_action(action: 'article_outdated_up', article_id: article.id)

            render json: article.serialized_json('normal')
          else
            render json:   { errors: article.errors.messages[:outdated].first },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      article = Article.find(params[:article_id])
      authorize article, :remove_outdated?

      respond_to do |format|
        format.json do
          if article.remove_outdated(current_user)
            track_action(action: 'article_outdated_down', article_id: article.id)

            render json: article.serialized_json('normal')
          else
            render json:   { errors: article.errors.messages[:outdated].first },
                   status: :unprocessable_entity
          end
        end
      end
    end
  end
end
