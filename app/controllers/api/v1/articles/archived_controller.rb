# frozen_string_literal: true

module Api::V1
  class Articles::ArchivedController < ApiController
    after_action :verify_authorized

    respond_to :json

    def create
      article = Article.find(params[:article_id])
      authorize article, :update?

      respond_to do |format|
        format.json do
          if article.update(archived: true)
            track_action(action: 'article_archived', article_id: article.id)

            flash.now[:success] = t('views.article.flash.successful_archived', title: article.title)

            render json: article.serialized_json('normal')
          else
            flash.now[:error] = t('views.article.flash.error_archived')

            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      article = Article.find(params[:article_id])
      authorize article, :update?

      respond_to do |format|
        format.json do
          if article.update(archived: false)
            track_action(action: 'article_unarchived', article_id: article.id)

            flash.now[:success] = t('views.article.flash.successful_unarchived', title: article.title)

            render json: article.serialized_json('normal')
          else
            flash.now[:error] = t('views.article.flash.error_unarchived')

            render json:   { errors: article.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end
  end
end
