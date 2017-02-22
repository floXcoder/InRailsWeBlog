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
    topic_owner?
  end

  def remove_topic?
    topic_owner?
  end

  private

  def topic_owner?
    @current_user && @topic && @topic.user?(@current_user)
  end
end

