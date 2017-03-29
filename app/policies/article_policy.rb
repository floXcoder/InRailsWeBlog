class ArticlePolicy
  attr_reader :current_user, :article

  def initialize(current_user, article)
    @current_user = current_user
    @article      = article
  end

  def show?
    correct_user?
  end

  def history?
    owner?
  end

  def create?
    @current_user
  end

  def edit?
    owner?
  end

  def update?
    owner?
  end

  def restore?
    owner?
  end

  def destroy?
    owner?
  end

  def vote_up?
    @current_user && @article.everyone? && !@article.user?(@current_user)
  end

  def vote_down?
    @current_user && @article.everyone? && !@article.user?(@current_user)
  end

  def add_outdated?
    @current_user && @article.everyone? && !@article.user?(@current_user)
  end

  def remove_outdated?
    @current_user && @article.everyone? && !@article.user?(@current_user)
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
    @article.everyone? || (@article.only_me? && owner?)
  end

  def owner?
    @current_user && @article.user?(@current_user)
  end
end

