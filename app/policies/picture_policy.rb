class PicturePolicy
  attr_reader :current_user, :picture

  def initialize(current_user, picture)
    @current_user = current_user
    @picture      = picture
  end

  def create?
    @current_user
  end

  def update?
    owner?
  end

  def destroy?
    owner?
  end

  private

  def owner?
    @current_user && @picture && @picture.user?(@current_user)
  end
end

