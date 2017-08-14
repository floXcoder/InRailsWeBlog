class Articles::OutdatedController < ApplicationController
  before_action :authenticate_user!
  before_action :verify_requested_format!
  after_action :verify_authorized

  respond_to :json

  def create
    article = Article.find(params[:article_id])
    authorize article, :add_outdated?

    respond_to do |format|
      format.json do
        if article.mark_as_outdated(current_user)
          head :ok
        else
          render json:   article.errors,
                 status: :forbidden
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
          head :ok
        else
          render json:   article.errors,
                 status: :forbidden
        end
      end
    end
  end
end
