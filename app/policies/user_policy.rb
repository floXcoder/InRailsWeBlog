class UserPolicy
  attr_reader :current_user, :user

  def initialize(current_user, user)
    @current_user = current_user
    @user         = user
  end

  def show?
    owner?
  end

  def bookmarks?
    owner?
  end

  def temporary?
    owner?
  end

  def comments?
    owner?
  end

  def activities?
    owner?
  end

  def preferences?
    owner?
  end

  def update_preferences?
    owner?
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

  def owner?
    @current_user && @user.user?(@current_user)
  end
end

