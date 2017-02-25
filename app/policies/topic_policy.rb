class TopicPolicy
  attr_reader :current_user, :topic

  def initialize(current_user, topic)
    @current_user = current_user
    @topic        = topic
  end

  def add_topic?
    @current_user
  end

  def change_topic?
    @current_user
  end

  def update_topic?
    owner?
  end

  def remove_topic?
    owner?
  end

  private

  def correct_user?
    @topic.everyone? || (@topic.only_me? && owner?)
  end

  def owner?
    @current_user && @topic.user?(@current_user)
  end
end

