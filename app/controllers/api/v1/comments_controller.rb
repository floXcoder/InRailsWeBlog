# frozen_string_literal: true

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
  class CommentsController < ApiController
    skip_before_action :authenticate_user!

    respond_to :json

    def index
      comments = Comment.includes(:commentable, :user).all
      comments = params[:limit] ? comments.limit(params[:limit].to_i) : comments.paginate(page: params[:page]&.to_i, per_page: InRailsWeBlog.settings.per_page)

      comments = comments.filter_by(comments, filter_params) unless filter_params.empty?
      comments = comments.order_by(filter_params[:order]) if filter_params[:order]

      complete = params[:complete] && admin_signed_in?

      with_cache? ? expires_in(InRailsWeBlog.settings.cache_time, public: true) : reset_cache_headers
      respond_to do |format|
        format.json do
          if complete
            render json: CommentFullSerializer.new(comments,
                                                   include: [:user, :commentable],
                                                   params:  { no_cache: complete },
                                                   meta:    { root: 'comments', **meta_attributes(pagination: comments) }).serializable_hash
          else
            render json: CommentSerializer.new(comments,
                                               include: [:user],
                                               meta:    { root: 'comments', **meta_attributes(pagination: comments) }).serializable_hash
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
                                       comments_ids: []).compact_blank
      else
        {}
      end
    end
  end
end
