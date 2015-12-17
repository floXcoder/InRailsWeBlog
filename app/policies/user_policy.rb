class UserPolicy
  attr_reader :current_user, :user

  def initialize(current_user, user)
    @current_user = current_user
    @user         = user
  end

  def bookmarks?
    correct_user?
  end

  def temporary?
    correct_user?
  end

  def preferences?
    correct_user?
  end

  def update_preferences?
    correct_user?
  end

  def edit?
    correct_user?
  end

  def update?
    correct_user?
  end

  def destroy?
    correct_user?
  end

  def admin?
    correct_user? && @current_user.admin?
  end

  private

  def correct_user?
    @current_user && @user && @current_user.id == @user.id
  end
end

