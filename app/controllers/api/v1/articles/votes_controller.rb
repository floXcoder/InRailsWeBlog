# frozen_string_literal: true

module Api::V1
  class Articles::VotesController < ApiController
    after_action :verify_authorized

    respond_to :json

    def create
      article = Article.find(params[:article_id])
      authorize article, :vote_up?

      respond_to do |format|
        format.json do
          if current_user.vote_for(article)
            track_action(action: 'article_vote_up', article_id: article.id)

            head :no_content
          else
            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      article = Article.find(params[:article_id])
      authorize article, :vote_down?

      respond_to do |format|
        format.json do
          if current_user.vote_against(article)
            track_action(action: 'article_vote_down', article_id: article.id)

            head :no_content
          else
            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end
  end
end
