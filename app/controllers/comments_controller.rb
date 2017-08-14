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

class CommentsController < ApplicationController
  before_action :verify_requested_format!

  respond_to :json

  def index
    comments = Comment.includes(:commentable, :user).all
    comments = params[:limit] ? comments.limit(params[:limit]) : comments.paginate(page: params[:page], per_page: CONFIG.per_page)

    unless filter_params.empty?
      # comments = comments.where('name ~* ?', filter_params[:name]) if filter_params[:name]
      comments = comments.where(accepted: filter_params[:accepted]) if filter_params[:accepted]
      comments = comments.where(ask_for_deletion: filter_params[:ask_for_deletion]) if filter_params[:ask_for_deletion]
      comments = comments.find_comments_by_user(filter_params[:user_id]) if filter_params[:user_id]
      comments = if filter_params[:order] == 'id_first'
                   comments.order('id ASC')
                 elsif filter_params[:order] == 'id_last'
                   comments.order('id DESC')
                 elsif filter_params[:order] == 'updated_first'
                   comments.order('updated_at ASC')
                 elsif filter_params[:order] == 'updated_last'
                   comments.order('updated_at DESC')
                 end if filter_params[:order]
    end

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
