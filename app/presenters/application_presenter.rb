class ApplicationPresenter < SimpleDelegator
  include AbstractController::Translation

  def initialize(model, view)
    @model, @view = model, view
    super(@model)
  end

  def h
    @view
  end

end
