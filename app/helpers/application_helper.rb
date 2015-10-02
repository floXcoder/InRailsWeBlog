module ApplicationHelper

  def w(msg)
    Rails.logger.ap msg, :warn
  end

  # noinspection RubyArgCount
  def present(model, options = {})
    return unless model

    klass = options[:presenter_class] || "#{model.class}Presenter".constantize
    presenter = klass.new(model, self)
    if block_given?
      yield(presenter)
    else
      presenter
    end
  end

end
