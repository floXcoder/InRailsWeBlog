module NullAttributesRemover
  def attributes(*args)
    super.compact
  end
end
