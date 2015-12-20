module CommentConcern
  extend ActiveSupport::Concern

  included do
    skip_before_action :authenticate_user!, only: [:comments]
    skip_after_action :verify_authorized, only: [:comments]
  end

  def comments
    class_model = params[:controller].classify.constantize
    record = class_model.find(params[:id])

    record_comments = record.comments.order('comments.created_at ASC')

    respond_to do |format|
      format.html { render json: record_comments, each_serializer: CommentSerializer, content_type: 'application/json' }
      format.json { render json: record_comments, each_serializer: CommentSerializer }
    end
  end

  def add_comment
    class_model = params[:controller].classify.constantize
    record = class_model.find(params[:id])
    authorize record

    comment = record.comment_threads.build
    authorize comment, :create?

    comment.assign_attributes(comment_params)
    comment.assign_attributes(user_id: current_user.id)

    respond_to do |format|
      if record.new_comment(comment)
        record.track_comments(comment)
        current_user.track_comments(comment)

        format.json { render json: comment, status: :accepted, location: record }
      else
        format.json { render json: comment.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_comment
    class_model = params[:controller].classify.constantize
    record = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comments][:id])
    authorize comment, :update?

    respond_to do |format|
      if record.update_comment(comment, comment_update_params)
        format.json { render json: comment, status: :accepted, location: record }
      else
        format.json { render json: comment.errors, status: :unprocessable_entity }
      end
    end
  end

  def remove_comment
    class_model = params[:controller].classify.constantize
    record = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comments][:id])
    authorize comment, :destroy?

    respond_to do |format|
      if (destroyed_comment_ids = record.remove_comment(comment))
        record.untrack_comments(comment)
        current_user.untrack_comments(comment)

        format.json { render json: { id: destroyed_comment_ids }, status: :accepted }
      else
        format.json { render json: comment.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def comment_params
    params.require(:comments).permit(:id,
                                     :title,
                                     :body,
                                     :rating,
                                     :parent_id)
  end

  def comment_update_params
    params.require(:comments).permit(:title,
                                     :rating,
                                     :body)
  end
end
