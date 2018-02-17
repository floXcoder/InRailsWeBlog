# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  commentable_id   :integer          not null
#  commentable_type :string           not null
#  user_id          :integer          not null
#  title            :string
#  body             :text
#  subject          :string
#  rating           :integer          default(0)
#  positive_reviews :integer          default(0)
#  negative_reviews :integer          default(0)
#  accepted         :boolean          default(TRUE), not null
#  deleted_at       :datetime
#  parent_id        :integer
#  lft              :integer
#  rgt              :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

module Api::V1
  class CommentsController < ApplicationController
    before_action :verify_requested_format!

    respond_to :json

    def index
      comments = Comment.includes(:commentable, :user).all
      comments = params[:limit] ? comments.limit(params[:limit]) : comments.paginate(page: params[:page], per_page: Setting.per_page)

      comments = comments.filter_by(comments, filter_params) unless filter_params.empty?
      comments = comments.order_by(filter_params[:order]) if filter_params[:order]

      respond_to do |format|
        format.json do
          if params[:complete]
            render json:            comments,
                   each_serializer: CommentFullSerializer,
                   meta:            meta_attributes(comments)
          else
            render json:            comments,
                   each_serializer: CommentSerializer,
                   meta:            meta_attributes(comments)
          end
        end
      end
    end

    private

    def filter_params
      if params[:filter]
        params.require(:filter).permit(:accepted,
                                       :order,
                                       :user_id,
                                       :ask_for_deletion,
                                       user_ids:     [],
                                       comments_ids: []).reject { |_, v| v.blank? }
      else
        {}
      end
    end
  end
end
