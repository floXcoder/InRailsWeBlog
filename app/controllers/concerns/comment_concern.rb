module CommentConcern
  extend ActiveSupport::Concern

  included do
    skip_before_action :authenticate_user!, only: [:comments]
    skip_after_action :verify_authorized, only: [:comments]
  end

  def comments
    class_model = params[:controller].classify.constantize
    record      = class_model.find(params[:id])

    comments, comments_tree = record.comments_tree(params[:page])

    respond_to do |format|
      format.json {
        render json:            comments_tree,
               each_serializer: CommentSerializer,
               meta:            meta_attributes(comments)
      }
    end
  end

  def add_comment
    class_model = params[:controller].classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comment_threads.build
    # authorize comment, :create?

    comment.assign_attributes(comment_params)
    comment.assign_attributes(user_id: current_user.id)

    respond_to do |format|
      if record.new_comment(comment)
        record.track_comments(comment)
        current_user.track_comments(comment)
        flash.now[:success] = t('views.comment.flash.successful_creation')
        format.json {
          render json: comment,
                 serializer: CommentFullSerializer,
                 status: :accepted
        }
      else
        flash.now[:success] = t('views.comment.flash.error_creation')
        format.json {
          render json: comment.errors,
                 status: :forbidden
        }
      end
    end
  end

  def update_comment
    class_model = params[:controller].classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comment][:id])
    # authorize comment, :update?

    respond_to do |format|
      if record.update_comment(comment, comment_update_params)
        flash.now[:success] = t('views.comment.flash.successful_update')
        format.json {
          render json: comment,
                 status: :accepted
        }
      else
        flash.now[:success] = t('views.comment.flash.error_update')
        format.json {
          render json: comment.errors,
                 status: :forbidden
        }
      end
    end
  end

  def remove_comment
    class_model = params[:controller].classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comment][:id])
    # authorize comment, :destroy?

    respond_to do |format|
      if (destroyed_comment_ids = record.remove_comment(comment))
        record.untrack_comments(comment)
        current_user.untrack_comments(comment)
        flash.now[:success] = t('views.comment.flash.successful_deletion')
        format.json {
          render json: { deleted_comment_ids: destroyed_comment_ids },
                 status: :accepted
        }
      else
        flash.now[:success] = t('views.comment.flash.error_deletion')
        format.json {
          render json: comment.errors,
                 status: :forbidden
        }
      end
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:id,
                                    :title,
                                    :body,
                                    :rating,
                                    :parent_id,
                                    :accepted)
  end

  def comment_update_params
    params.require(:comment).permit(:title,
                                    :rating,
                                    :body,
                                    :accepted)
  end
end
