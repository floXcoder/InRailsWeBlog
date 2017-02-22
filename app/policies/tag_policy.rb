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

  private

  def correct_user?
    @tag.everyone? || (@current_user && @tag.only_me? && @tag.tagger?(@current_user)) || (@current_user && @current_user.admin?)
  end

  def owner?
    @current_user && @tag && (@tag.tagger?(@current_user) || @current_user.admin?)
  end
end

