module CommentConcern
  extend ActiveSupport::Concern

  included do
    skip_before_action :authenticate_user!, only: [:comments]
    skip_after_action :verify_authorized, only: [:comments]
  end

  def comments
    class_model = controller_path.classify.constantize
    record      = class_model.find(params[:id])

    comments, comments_tree = record.comments_tree(params[:page])

    respond_to do |format|
      format.json do
        render json:            comments_tree,
               each_serializer: CommentSerializer,
               meta:            meta_attributes(comments)
      end
    end
  end

  def add_comment
    class_model = controller_path.classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comment_threads.build

    comment.assign_attributes(comment_params.merge(user_id: current_user.id))

    respond_to do |format|
      if record.new_comment(comment)
        record.create_activity(action: :commented_on, owner: current_user) if record.respond_to?(:create_activity)

        flash.now[:success] = t('views.comment.flash.successful_creation')
        format.json do
          render json:       comment,
                 serializer: CommentSerializer,
                 status:     :accepted
        end
      else
        flash.now[:success] = t('views.comment.flash.error_creation')
        format.json do
          render json:   comment.errors,
                 status: :forbidden
        end
      end
    end
  end

  def update_comment
    class_model = controller_path.classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comment][:id])

    respond_to do |format|
      if record.update_comment(comment, comment_update_params)
        record.create_activity(action: :comment_updated, owner: current_user) if record.respond_to?(:create_activity)

        flash.now[:success] = t('views.comment.flash.successful_update')
        format.json do
          render json:   comment,
                 serializer: CommentSerializer,
                 status: :accepted
        end
      else
        flash.now[:success] = t('views.comment.flash.error_update')
        format.json do
          render json:   comment.errors,
                 status: :forbidden
        end
      end
    end
  end

  def remove_comment
    class_model = controller_path.classify.constantize
    record      = class_model.find(params[:id])
    authorize record

    comment = record.comments.find(params[:comment][:id])

    respond_to do |format|
      if (destroyed_comment_ids = record.remove_comment(comment))
        record.create_activity(action: :comment_removed, owner: current_user) if record.respond_to?(:create_activity)

        flash.now[:success] = t('views.comment.flash.successful_deletion')
        format.json do
          render json:   { ids: destroyed_comment_ids },
                 status: :accepted
        end
      else
        flash.now[:success] = t('views.comment.flash.error_deletion')
        format.json do
          render json:   comment.errors,
                 status: :forbidden
        end
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
