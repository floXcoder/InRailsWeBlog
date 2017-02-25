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
    @tag.everyone? || (@tag.only_me? && owner?)
  end

  def owner?
    @current_user && @tag.tagger?(@current_user)
  end
end

