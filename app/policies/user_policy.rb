# frozen_string_literal: true

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

  def recents?
    owner?
  end

  def comments?
    owner?
  end

  def show?
    correct_user?
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

  private

  def correct_user?
    @user.everyone? || (@user.only_me? && owner?)
  end

  def owner?
    @current_user && @user.user?(@current_user)
  end
end
