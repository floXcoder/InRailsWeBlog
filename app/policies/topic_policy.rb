# frozen_string_literal: true

class TopicPolicy
  attr_reader :current_user, :topic

  def initialize(current_user, topic)
    @current_user = current_user
    @topic        = topic
  end

  def switch?
    owner? || contributor?
  end

  def show?
    owner?
  end

  def create?
    @current_user
  end

  def update?
    owner?
  end

  def share?
    owner?
  end

  def destroy?
    owner?
  end

  private

  def correct_user?
    @topic.everyone? || (@topic.only_me? && owner?)
  end

  def owner?
    @current_user && @topic.user?(@current_user)
  end

  def contributor?
    @current_user && @current_user.contributed_topic_ids.include?(@topic.id) && @topic.everyone?
  end
end
