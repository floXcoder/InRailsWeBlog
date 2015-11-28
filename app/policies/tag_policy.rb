class TagPolicy
  attr_reader :current_user, :tag

  def initialize(current_user, tag)
    @current_user = current_user
    @tag          = tag
  end

  def create?
    @current_user
  end

  def edit?
    @current_user && @tag.tagger?(@current_user)
  end

  def update?
    @current_user && @tag.tagger?(@current_user)
  end

  def destroy?
    @current_user && @tag.tagger?(@current_user)
  end

end

