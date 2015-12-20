class CommentPolicy
  attr_reader :current_user, :comment

  def initialize(current_user, comment)
    @current_user = current_user
    @comment      = comment
  end

  def create?
    @current_user
  end

  def update?
    @current_user && @comment.user.id == @current_user.id
  end

  def destroy?
    @current_user && @comment.user.id == @current_user.id
  end
end

