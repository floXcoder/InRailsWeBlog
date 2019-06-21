# frozen_string_literal: true

class BaseQuery
  attr_accessor :current_user, :current_admin

  def initialize(current_user, current_admin)
    @current_user  = current_user
    @current_admin = current_admin
  end

end
