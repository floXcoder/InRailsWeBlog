class ArticleSampleSerializer < ActiveModel::Serializer
  cache key: 'article_sample', expires_in: 12.hours

  include NullAttributesRemover

  attributes :id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :content,
             :draft,
             :visibility,
             :current_language,
             :updated_at,
             :link,
             :slug,
             :outdated_articles_count,
             :comments_count

  belongs_to :user, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer

  def mode_translated
    object.mode_to_tr
  end

  def title
    object.try(:search_highlights) && object.try(:search_highlights)[:title] ? object.search_highlights[:title] : object.title
  end

  def summary
    object.try(:search_highlights) && object.try(:search_highlights)[:summary] ? object.search_highlights[:summary] : object.summary
  end

  def content
    object.try(:search_highlights) && object.try(:search_highlights)[:content] ? object.search_highlights[:content] : object.summary_content
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).mb_chars.downcase.to_s
  end

  def outdated_articles_count
    object.outdated_articles_count
  end

  def comments_count
    object.comments_count
  end

  include Rails.application.routes.url_helpers

  def link
    article_path(object)
  end
end
