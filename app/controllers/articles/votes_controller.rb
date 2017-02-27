class Articles::VotesController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized

  respond_to :json

  def up
    article = Article.find(params[:id])
    authorize article, :vote_up?

    respond_to do |format|
      format.json do
        if current_user.vote_for(article)
          current_user.create_activity action: :vote_up, recipient: article, owner: current_user

          render json:     article,
                 status:   :accepted,
                 location: article
        else
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end

  def down
    article = Article.find(params[:id])
    authorize article, :vote_down?

    respond_to do |format|
      format.json do
        if current_user.vote_against(article)
          current_user.create_activity action: :vote_down, recipient: article, owner: current_user

          render json:     article,
                 status:   :accepted,
                 location: article
        else
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end
end
