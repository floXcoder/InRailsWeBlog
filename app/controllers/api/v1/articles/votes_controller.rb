module Api::V1
  class Articles::VotesController < ApplicationController
    before_action :authenticate_user!
    before_action :verify_requested_format!
    after_action :verify_authorized

    respond_to :json

    def create
      article = Article.find(params[:article_id])
      authorize article, :vote_up?

      respond_to do |format|
        format.json do
          if current_user.vote_for(article)
            article.create_activity(action: :vote_up, owner: current_user)

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
            article.create_activity(action: :vote_down, owner: current_user)

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
