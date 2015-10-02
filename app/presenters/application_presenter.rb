class ApplicationPresenter < SimpleDelegator
  include AbstractController::Translation

  def initialize(model, view)
    @model, @view = model, view
    super(@model)
  end

  def h
    @view
  end

  def fa_icon(icon, classes = '')
    h.content_tag :i, nil, class: "fa fa-#{icon} #{classes}"
  end


end
