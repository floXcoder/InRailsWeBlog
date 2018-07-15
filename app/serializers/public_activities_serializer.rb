class PublicActivitiesSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  cache key: 'public_activities', expires_in: CONFIG.cache_time

  attributes :id,
             :trackable_id,
             :trackable_type,
             :key,
             :parameters,
             :recipient_id,
             :recipient_type,
             :performed_at,
             :link

  def performed_at
    I18n.l(object.created_at, format: :custom).mb_chars.downcase.to_s
  end

  def link
    if object.trackable_type == 'Article'
      article_path(object.trackable_id)
    elsif object.trackable_type == 'Tag'
      tag_path(object.trackable_id)
    elsif object.trackable_type == 'TaggedArticle'
      article_path(object.recipient_id)
    elsif object.trackable_type == 'BookmarkedArticle'
      article_path(object.recipient_id)
    elsif object.trackable_type == 'Comment'
      url_for(
        controller: object.recipient_type.tableize,
        action: 'show',
        id: object.recipient_id,
        anchor: "comment-#{object.trackable_id}",
        only_path: true
      )
    else
      nil
    end
  end
end
