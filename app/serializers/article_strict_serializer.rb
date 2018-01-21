# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  link         :boolean          default(FALSE), not null
#  draft       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticleStrictSerializer < ActiveModel::Serializer
  cache key: 'article_strict', expires_in: 12.hours

  include NullAttributesRemover

  # Methods with attributes must be defined to work with searchkick results
  attributes :id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :draft,
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
