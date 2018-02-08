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
             :date,
             :date_short,
             :link,
             :slug,
             :outdated_articles_count,
             :comments_count,
             :parent_tag_ids,
             :child_tag_ids

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

  def date
    I18n.l(object.updated_at, format: :custom_full_date).sub(/^[0]+/, '')
  end

  def date_short
    I18n.l(object.updated_at, format: :short).split(' ').map(&:capitalize)
  end

  def outdated_articles_count
    object.outdated_articles_count
  end

  def comments_count
    object.comments_count
  end

  def parent_tag_ids
    object.parent_tags.ids
  end

  def child_tag_ids
    object.child_tags.ids
  end

  include Rails.application.routes.url_helpers

  def link
    article_path(object)
  end
end
