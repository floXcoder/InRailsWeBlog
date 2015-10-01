module ApplicationHelper

  def w(msg)
    Rails.logger.ap msg, :warn
  end

end
