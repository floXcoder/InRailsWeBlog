class ArticlePolicy
  attr_reader :current_user, :article

  def initialize(current_user, article)
    @current_user = current_user
    @article = article
  end

  def create?
    @current_user
  end

  def show?
    @article.everyone? || (@current_user && @article.only_me? && @article.author?(@current_user))
  end

  def history?
    @current_user && @article.author?(@current_user)
  end

  def restore?
    @current_user && @article.author?(@current_user)
  end

  def edit?
    @current_user && @article.author?(@current_user)
  end

  def update?
    @current_user && @article.author?(@current_user)
  end

  def destroy?
    @current_user && @article.author?(@current_user)
  end

end

