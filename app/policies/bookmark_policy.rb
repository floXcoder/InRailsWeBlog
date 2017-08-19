class BookmarkPolicy
  attr_reader :current_user, :bookmark

  def initialize(current_user, bookmark)
    @current_user = current_user
    @bookmark     = bookmark
  end

  def create?
    @current_user
  end

  def destroy?
    owner?
  end

  private

  def owner?
    @current_user && @bookmark.user?(@current_user)
  end
end
