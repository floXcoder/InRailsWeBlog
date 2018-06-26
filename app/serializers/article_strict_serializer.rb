class ArticleStrictSerializer < ActiveModel::Serializer
  include NullAttributesRemover

  cache key: 'article_strict', expires_in: 12.hours

  # Methods with attributes must be defined to work with searchkick results
  attributes :id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :draft,
             :date,
             :visibility,
             :current_language,
             :slug

  def id
    object.id
  end

  def mode
    object.mode
  end

  def mode_translated
    object.mode_translated
  end

  def title
    object.title
  end

  def summary
    object.summary
  end

  def draft
    object.draft
  end

  def date
    object.created_at.to_i
  end

  def visibility
    object.visibility
  end

  def current_language
    object.current_language
  end

  def slug
    object.slug
  end
end
