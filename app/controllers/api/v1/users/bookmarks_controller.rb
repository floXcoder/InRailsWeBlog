# frozen_string_literal: true

module Api::V1
  class Users::BookmarksController < ApiController
    after_action :verify_authorized

    respond_to :json

    def index
      user = current_user&.id == params[:user_id]&.to_i ? current_user : User.friendly.find(params[:user_id])
      admin_or_authorize user, :bookmarks?

      bookmarks = user.bookmarks.includes(bookmarked: [:user])

      bookmarks = bookmarks.where(topic_id: params[:topic_id]) if params[:topic_id].present?

      respond_to do |format|
        format.json do
          render json: BookmarkSerializer.new(bookmarks,
                                              meta: { root: 'bookmarks' }).serializable_hash
        end
      end
    end

    def create
      user     = current_user&.id == params[:user_id]&.to_i ? current_user : User.friendly.find(params[:user_id])
      bookmark = user.bookmarks.build
      authorize bookmark

      respond_to do |format|
        format.json do
          if bookmark.add(user, bookmark_params[:bookmarked_type], bookmark_params[:bookmarked_id], bookmark_params[:topic_id])
            render json:   BookmarkSerializer.new(bookmark).serializable_hash,
                   status: :created
          else
            render json:   { errors: bookmark.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    def destroy
      user     = current_user&.id == params[:user_id]&.to_i ? current_user : User.friendly.find(params[:user_id])
      bookmark = Bookmark.find(params[:id])
      authorize bookmark

      respond_to do |format|
        format.json do
          if bookmark.remove(user, bookmark_params[:bookmarked_type], bookmark_params[:bookmarked_id])
            head :no_content
          else
            render json:   { errors: bookmark.errors },
                   status: :unprocessable_entity
          end
        end
      end
    end

    private

    def bookmark_params
      params.require(:bookmark).permit(:bookmarked_type,
                                       :bookmarked_id,
                                       :topic_id)
    end
  end
end
