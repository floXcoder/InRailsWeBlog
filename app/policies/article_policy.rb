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

  def add_bookmark?
    @current_user
  end

  def remove_bookmark?
    @current_user && @current_user.bookmarks.exists?(@article.id)
  end

  def vote_up?
    @current_user && !@article.voted_by?(@current_user)
  end

  def vote_down?
    @current_user && !@article.voted_by?(@current_user)
  end

  def add_outdated?
    @current_user
  end

  def remove_outdated?
    @current_user && @current_user.marked_as_outdated.exists?(@article.id)
  end

  # Comments
  def add_comment?
    @current_user && correct_user? && @article.allow_comment?
  end

  def update_comment?
    @current_user && correct_user? && @article.allow_comment?
  end

  def remove_comment?
    @current_user && correct_user? && @article.allow_comment?
  end

  private

  def correct_user?
    @article.everyone? || (@current_user && @article.only_me? && @article.author?(@current_user)) || (@current_user && @current_user.admin?)
  end

  def owner?
    @current_user && (@article.author?(@current_user)|| @current_user.admin?)
  end
end

