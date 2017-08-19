class TagPolicy
  attr_reader :current_user, :tag

  def initialize(current_user, tag)
    @current_user = current_user
    @tag          = tag
  end

  def show?
    correct_user?
  end

  def create?
    @current_user
  end

  def edit?
    owner?
  end

  def update?
    owner?
  end

  def destroy?
    owner?
  end

  # Comments
  def add_comment?
    @current_user && @tag.everyone? && @tag.allow_comment? && !@tag.user?(@current_user)
  end

  def update_comment?
    @current_user && @tag.everyone? && @tag.allow_comment? && !@tag.user?(@current_user)
  end

  def remove_comment?
    @current_user && @tag.everyone? && @tag.allow_comment? && !@tag.user?(@current_user)
  end

  private

  def correct_user?
    @tag.everyone? || (@tag.only_me? && owner?)
  end

  def owner?
    @current_user && @tag.user?(@current_user)
  end
end
