class UserPolicy
  attr_reader :current_user, :user

  def initialize(current_user, user)
    @current_user = current_user
    @user         = user
  end

  def bookmarks?
    owner?
  end

  def draft?
    owner?
  end

  def comments?
    owner?
  end

  def activities?
    owner?
  end

  def show?
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

  def settings?
    owner?
  end

  def update_settings?
    owner?
  end

  private

  def owner?
    @current_user && @user.user?(@current_user)
  end
end

