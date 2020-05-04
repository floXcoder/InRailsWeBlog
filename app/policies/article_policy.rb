# frozen_string_literal: true

class ArticlePolicy
  attr_reader :current_user, :article

  def initialize(current_user, article)
    @current_user = current_user
    @article      = article
  end

  def show?
    correct_user?
  end

  def shared?
    owner? || public_link?
  end

  def history?
    owner? || contributor?
  end

  def create?
    @current_user
  end

  def edit?
    owner? || contributor?
  end

  def update?
    owner? || contributor?
  end

  def share?
    owner?
  end

  def check_links?
    owner?
  end

  def restore?
    owner? || contributor?
  end

  def destroy?
    owner?
  end

  def vote_up?
    @current_user && @article.everyone? && !@article.user?(@current_user) && !@article.voted_by?(@current_user)
  end

  def vote_down?
    @current_user && @article.everyone? && !@article.user?(@current_user) && !@article.voted_by?(@current_user)
  end

  def add_outdated?
    @current_user && correct_user?
  end

  def remove_outdated?
    @current_user && correct_user?
  end

  # Comments
  def add_comment?
    @current_user && @article.everyone? && @article.allow_comment? && !@article.user?(@current_user)
  end

  def update_comment?
    @current_user && @article.everyone? && @article.allow_comment? && !@article.user?(@current_user)
  end

  def remove_comment?
    @current_user && @article.everyone? && @article.allow_comment? && !@article.user?(@current_user)
  end

  private

  def correct_user?
    @article.everyone? || (@article.only_me? && owner?) || contributor?
  end

  def owner?
    @current_user && @article.user?(@current_user)
  end

  def public_link?
    @article.only_me? && @article.public_share_link == @article.shared_link
  end

  def contributor?
    @current_user&.contributed_topic_ids&.include?(@article.topic_id)
  end
end
